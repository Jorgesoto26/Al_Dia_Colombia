/**
 * Componente Reutilizable: BottomBannerAd
 * Al Día Colombia - Banner Adaptativo de Google AdMob
 *
 * Características:
 * - Utiliza BannerAdSize.ANCHORED_ADAPTIVE_BANNER para ajustarse al ancho dinámico de la pantalla.
 * - Utiliza ESTRICTAMENTE el identificador de prueba oficial de Google (TestIds.ADAPTIVE_BANNER).
 * - Maneja estados de carga y error: si no hay conexión o falla la carga, colapsa a null para no dejar espacios vacíos ni arruinar la UI.
 * - Respeta los insets de seguridad y la separación con la barra de navegación (Bottom Tab Bar).
 */
import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useTheme } from '../../context/ThemeContext';

interface BottomBannerAdProps {
  /**
   * Ad Unit ID. Por defecto utiliza SIEMPRE el Test Ad Unit ID oficial de Google.
   */
  adUnitId?: string;
  /**
   * Estilo contenedor personalizado opcional
   */
  style?: object;
}

// ID de prueba oficial de Google para Banners Adaptativos
const TEST_AD_UNIT_ID = Platform.select({
  android: TestIds.ADAPTIVE_BANNER,
  ios: TestIds.ADAPTIVE_BANNER,
  default: TestIds.ADAPTIVE_BANNER,
});

export const BottomBannerAd: React.FC<BottomBannerAdProps> = ({
  adUnitId = TEST_AD_UNIT_ID,
  style,
}) => {
  const { isDark } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Si hay error al cargar (por ejemplo, modo offline), colapsa el componente limpiamente
  if (hasError) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(11, 15, 25, 0.92)' : 'rgba(255, 255, 255, 0.94)',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
          minHeight: isLoaded ? undefined : 0,
        },
        style,
      ]}
    >
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setIsLoaded(true);
          setHasError(false);
        }}
        onAdFailedToLoad={error => {
          // En caso de fallo silencioso (ej. sin internet), no mostramos bloque roto
          setHasError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
});

export default BottomBannerAd;

