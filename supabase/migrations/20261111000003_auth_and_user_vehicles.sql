-- ============================================================================
-- AL DÍA COLOMBIA - AUTENTICACIÓN HÍBRIDA (USUARIO + PIN Y GOOGLE) & NUBE
-- Migración: 20261111000003_auth_and_user_vehicles.sql
-- ============================================================================

-- Extensión para hash criptográfico seguro en PostgreSQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLA: app_accounts (Cuentas de usuario de Al Día Colombia)
-- Soporta:
--  a) Nombre de usuario + PIN de 4 dígitos (con hash bcrypt)
--  b) Inicio de sesión con Google (por google_id / email)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(60) UNIQUE,
    pin_hash TEXT,
    google_id TEXT UNIQUE,
    email TEXT,
    display_name TEXT,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('username_pin', 'google')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.app_accounts IS 'Cuentas de usuario autenticadas por Usuario+PIN o Google para sincronización de vehículos.';

-- ----------------------------------------------------------------------------
-- 2. TABLA: user_vehicles (Vehículos respaldados en la nube)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_vehicles (
    id TEXT NOT NULL,
    account_id UUID NOT NULL REFERENCES public.app_accounts(id) ON DELETE CASCADE,
    alias VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('particular', 'moto', 'taxi')),
    plate VARCHAR(10) NOT NULL,
    last_digit VARCHAR(2) NOT NULL,
    first_digit VARCHAR(2) NOT NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    is_exempt BOOLEAN NOT NULL DEFAULT false,
    exemption_type VARCHAR(30) NOT NULL DEFAULT 'ninguno',
    notify_previous_day BOOLEAN NOT NULL DEFAULT true,
    notify_same_day BOOLEAN NOT NULL DEFAULT true,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (account_id, plate)
);

CREATE INDEX IF NOT EXISTS idx_user_vehicles_account ON public.user_vehicles(account_id);
CREATE INDEX IF NOT EXISTS idx_user_vehicles_plate ON public.user_vehicles(plate);

-- ----------------------------------------------------------------------------
-- 3. PROCEDIMIENTO RPC: Iniciar sesión o registrarse con Usuario + PIN (4 dígitos)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.login_or_register_pin_user(
    p_username TEXT,
    p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_username TEXT;
    v_clean_pin TEXT;
    v_account RECORD;
    v_account_id UUID;
BEGIN
    -- Normalizar entradas
    v_clean_username := lower(trim(p_username));
    v_clean_pin := trim(p_pin);

    -- Validaciones básicas
    IF length(v_clean_username) < 3 THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'El nombre de usuario debe tener al menos 3 caracteres.'
        );
    END IF;

    IF length(v_clean_pin) != 4 OR v_clean_pin !~ '^[0-9]{4}$' THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'El PIN debe ser exactamente de 4 dígitos numéricos.'
        );
    END IF;

    -- Buscar si ya existe la cuenta
    SELECT * INTO v_account 
    FROM public.app_accounts 
    WHERE username = v_clean_username;

    IF FOUND THEN
        -- Verificar si el PIN coincide con el hash almacenado
        IF v_account.pin_hash = crypt(v_clean_pin, v_account.pin_hash) THEN
            UPDATE public.app_accounts 
            SET updated_at = now() 
            WHERE id = v_account.id;

            RETURN jsonb_build_object(
                'success', true,
                'is_new', false,
                'account_id', v_account.id,
                'username', v_account.username,
                'display_name', v_account.display_name,
                'provider', v_account.provider,
                'created_at', v_account.created_at
            );
        ELSE
            RETURN jsonb_build_object(
                'success', false,
                'message', 'El PIN de 4 dígitos es incorrecto para el usuario @' || v_clean_username || '.'
            );
        END IF;
    ELSE
        -- Usuario nuevo: Registrar automáticamente con hash bcrypt
        INSERT INTO public.app_accounts (
            username,
            pin_hash,
            display_name,
            provider
        ) VALUES (
            v_clean_username,
            crypt(v_clean_pin, gen_salt('bf')),
            v_clean_username,
            'username_pin'
        )
        RETURNING id INTO v_account_id;

        RETURN jsonb_build_object(
            'success', true,
            'is_new', true,
            'account_id', v_account_id,
            'username', v_clean_username,
            'display_name', v_clean_username,
            'provider', 'username_pin',
            'created_at', now()
        );
    END IF;
END;
$$;

-- ----------------------------------------------------------------------------
-- 4. PROCEDIMIENTO RPC: Iniciar sesión o registrarse con Google
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.login_or_register_google_user(
    p_google_id TEXT,
    p_email TEXT,
    p_name TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_email TEXT;
    v_account RECORD;
    v_account_id UUID;
BEGIN
    v_clean_email := lower(trim(p_email));

    SELECT * INTO v_account 
    FROM public.app_accounts 
    WHERE google_id = p_google_id OR email = v_clean_email;

    IF FOUND THEN
        UPDATE public.app_accounts 
        SET display_name = COALESCE(p_name, display_name),
            email = v_clean_email,
            updated_at = now()
        WHERE id = v_account.id;

        RETURN jsonb_build_object(
            'success', true,
            'is_new', false,
            'account_id', v_account.id,
            'email', v_clean_email,
            'display_name', v_account.display_name,
            'provider', 'google',
            'created_at', v_account.created_at
        );
    ELSE
        INSERT INTO public.app_accounts (
            google_id,
            email,
            display_name,
            provider
        ) VALUES (
            p_google_id,
            v_clean_email,
            COALESCE(p_name, split_part(v_clean_email, '@', 1)),
            'google'
        )
        RETURNING id INTO v_account_id;

        RETURN jsonb_build_object(
            'success', true,
            'is_new', true,
            'account_id', v_account_id,
            'email', v_clean_email,
            'display_name', COALESCE(p_name, split_part(v_clean_email, '@', 1)),
            'provider', 'google',
            'created_at', now()
        );
    END IF;
END;
$$;

-- ----------------------------------------------------------------------------
-- 5. PROCEDIMIENTO RPC: Sincronización bidireccional atómica de vehículos
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_account_vehicles(
    p_account_id UUID,
    p_local_vehicles JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item JSONB;
    v_existing_count INT;
    v_result JSONB;
BEGIN
    -- Validar que la cuenta existe
    IF NOT EXISTS (SELECT 1 FROM public.app_accounts WHERE id = p_account_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Cuenta de usuario no encontrada.'
        );
    END IF;

    -- Si vienen vehículos locales, hacer upsert en la nube
    IF p_local_vehicles IS NOT NULL AND jsonb_array_length(p_local_vehicles) > 0 THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_local_vehicles)
        LOOP
            INSERT INTO public.user_vehicles (
                id,
                account_id,
                alias,
                vehicle_type,
                plate,
                last_digit,
                first_digit,
                city_id,
                is_exempt,
                exemption_type,
                notify_previous_day,
                notify_same_day,
                is_favorite,
                updated_at
            ) VALUES (
                COALESCE(v_item->>'id', gen_random_uuid()::text),
                p_account_id,
                COALESCE(v_item->>'alias', 'Mi Vehículo'),
                COALESCE(v_item->>'vehicle_type', 'particular'),
                upper(trim(v_item->>'plate')),
                COALESCE(v_item->>'last_digit', ''),
                COALESCE(v_item->>'first_digit', ''),
                (v_item->>'city_id')::UUID,
                COALESCE((v_item->>'is_exempt')::BOOLEAN, false),
                COALESCE(v_item->>'exemption_type', 'ninguno'),
                COALESCE((v_item->>'notify_previous_day')::BOOLEAN, true),
                COALESCE((v_item->>'notify_same_day')::BOOLEAN, true),
                COALESCE((v_item->>'is_favorite')::BOOLEAN, false),
                now()
            )
            ON CONFLICT (account_id, plate) DO UPDATE SET
                alias = EXCLUDED.alias,
                vehicle_type = EXCLUDED.vehicle_type,
                last_digit = EXCLUDED.last_digit,
                first_digit = EXCLUDED.first_digit,
                city_id = EXCLUDED.city_id,
                is_exempt = EXCLUDED.is_exempt,
                exemption_type = EXCLUDED.exemption_type,
                notify_previous_day = EXCLUDED.notify_previous_day,
                notify_same_day = EXCLUDED.notify_same_day,
                is_favorite = EXCLUDED.is_favorite,
                updated_at = now();
        END LOOP;
    END IF;

    -- Obtener la lista completa unificada de vehículos de la cuenta
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', id,
            'alias', alias,
            'vehicle_type', vehicle_type,
            'plate', plate,
            'last_digit', last_digit,
            'first_digit', first_digit,
            'city_id', city_id,
            'is_exempt', is_exempt,
            'exemption_type', exemption_type,
            'notify_previous_day', notify_previous_day,
            'notify_same_day', notify_same_day,
            'is_favorite', is_favorite
        )
    ) INTO v_result
    FROM public.user_vehicles
    WHERE account_id = p_account_id;

    RETURN jsonb_build_object(
        'success', true,
        'vehicles', COALESCE(v_result, '[]'::jsonb)
    );
END;
$$;

