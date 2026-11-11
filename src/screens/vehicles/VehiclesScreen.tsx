/**
 * Pestaña 2: "Mis Vehículos y Alertas"
 * Al Día Colombia
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVehicles } from '../../context/VehicleContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AppBackground } from '../../components/AppBackground';
import { GlassCard } from '../../components/GlassCard';
import {
  CarIcon,
  MotoIcon,
  TaxiIcon,
  PlusIcon,
  TrashIcon,
  StarIcon,
  CloseIcon,
  CheckIcon,
  BellIcon,
  MapPinIcon,
} from '../../components/Icons';
import { COLORS } from '../../theme/colors';
import { UserVehicle, ExemptionType } from '../../types/picoYPlaca.types';
import { VehicleType } from '../../types/database.types';
import { formatPlateDisplay } from '../../utils/formatters';

export const VehiclesScreen: React.FC = () => {
  const {
    vehicles,
    cities,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setFavorite,
    syncCloudVehicles,
    sendTestNotification,
  } = useVehicles();
  const { isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === 'android';
  // En teléfonos con barra física o virtual de 3 botones (48dp), garantizamos
  // que ningún botón inferior del modal quede detrás de los botones de navegación.
  const modalBottomPadding = isAndroid
    ? Math.max(insets.bottom, 48) + 24
    : Math.max(insets.bottom, 24) + 16;
  const {
    account,
    isAuthenticated,
    loginWithUsernameAndPin,
    loginWithGoogle,
    logout,
  } = useAuth();

  // Estados para autenticación híbrida y respaldo en la nube
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Modal State para Vehículos
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<UserVehicle | null>(null);

  // Form Fields
  const [alias, setAlias] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('particular');
  const [cityId, setCityId] = useState(cities[0]?.id || '');
  const [notifyPreviousDay, setNotifyPreviousDay] = useState(true);
  const [notifySameDay, setNotifySameDay] = useState(true);
  const [isExempt, setIsExempt] = useState(false);
  const [exemptionType, setExemptionType] = useState<ExemptionType>('electrico_hibrido');

  // Abre el formulario de vehículo directamente
  const openVehicleForm = (vehicle?: UserVehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setAlias(vehicle.alias);
      setPlate(vehicle.plate);
      setVehicleType(vehicle.vehicle_type);
      setCityId(vehicle.city_id);
      setNotifyPreviousDay(vehicle.notify_previous_day ?? true);
      setNotifySameDay(vehicle.notify_same_day ?? true);
      setIsExempt(vehicle.is_exempt ?? false);
      setExemptionType(vehicle.exemption_type || 'electrico_hibrido');
    } else {
      setEditingVehicle(null);
      setAlias('');
      setPlate('');
      setVehicleType('particular');
      setCityId(cities[0]?.id || '');
      setNotifyPreviousDay(true);
      setNotifySameDay(true);
      setIsExempt(false);
      setExemptionType('electrico_hibrido');
    }
    setModalVisible(true);
  };

  // Botón Agregar: Si no está logueado, pide primero login; si ya lo está, abre el formulario
  const handleAddVehiclePress = (vehicle?: UserVehicle) => {
    if (vehicle) {
      openVehicleForm(vehicle);
      return;
    }

    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }

    openVehicleForm();
  };

  const handleSave = async () => {
    if (!alias.trim()) {
      Alert.alert('Falta información', 'Por favor ingresa un nombre o alias para el vehículo (ej. "Mi Carro").');
      return;
    }

    const cleanPlate = plate.trim().toUpperCase();
    if (!cleanPlate || cleanPlate.length < 3) {
      Alert.alert('Placa inválida', 'Por favor ingresa una placa colombiana válida (ej. "ABC123").');
      return;
    }

    try {
      if (editingVehicle) {
        await updateVehicle({
          ...editingVehicle,
          alias: alias.trim(),
          plate: cleanPlate,
          vehicle_type: vehicleType,
          city_id: cityId,
          is_exempt: isExempt,
          exemption_type: isExempt ? exemptionType : 'ninguno',
          notify_previous_day: notifyPreviousDay,
          notify_same_day: notifySameDay,
        });
      } else {
        await addVehicle({
          alias: alias.trim(),
          plate: cleanPlate,
          vehicle_type: vehicleType,
          city_id: cityId,
          last_digit: '',
          first_digit: '',
          is_exempt: isExempt,
          exemption_type: isExempt ? exemptionType : 'ninguno',
          notify_previous_day: notifyPreviousDay,
          notify_same_day: notifySameDay,
        });
      }

      setModalVisible(false);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el vehículo. Intenta de nuevo.');
    }
  };

  const handleDelete = (vehicle: UserVehicle) => {
    Alert.alert(
      'Eliminar Vehículo',
      `¿Deseas eliminar "${vehicle.alias}" (${formatPlateDisplay(vehicle.plate)}) de tus vehículos guardados?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteVehicle(vehicle.id),
        },
      ]
    );
  };

  const handlePinSubmit = async () => {
    if (!authUsername.trim()) {
      Alert.alert('Atención', 'Por favor ingresa un nombre de usuario.');
      return;
    }
    if (authPin.trim().length !== 4) {
      Alert.alert('Atención', 'El PIN debe ser exactamente de 4 dígitos numéricos.');
      return;
    }

    try {
      setAuthSubmitting(true);
      const res = await loginWithUsernameAndPin(authUsername, authPin);
      if (res.success) {
        setAuthModalVisible(false);
        setAuthUsername('');
        setAuthPin('');
        await syncCloudVehicles();
        // Abrir inmediatamente el formulario de registro del vehículo
        openVehicleForm();
      } else {
        Alert.alert('No fue posible ingresar', res.message || 'Verifica los datos ingresados.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Ocurrió un error inesperado al conectar.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleSubmit = async () => {
    if (!googleEmail.trim() || !googleEmail.includes('@')) {
      Alert.alert('Atención', 'Por favor ingresa un correo de Google válido.');
      return;
    }

    try {
      setGoogleSubmitting(true);
      const fakeGoogleId = 'g_' + googleEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const res = await loginWithGoogle({
        googleId: fakeGoogleId,
        email: googleEmail,
        name: googleName.trim() || googleEmail.split('@')[0],
      });

      if (res.success) {
        setGoogleModalVisible(false);
        setAuthModalVisible(false);
        setGoogleEmail('');
        setGoogleName('');
        await syncCloudVehicles();
        // Abrir inmediatamente el formulario de registro del vehículo
        openVehicleForm();
      } else {
        Alert.alert('Error', res.message || 'No se pudo vincular con Google.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Ocurrió un error inesperado.');
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleUserOptions = () => {
    Alert.alert(
      `Cuenta: ${account?.displayName}`,
      `Conectado vía ${account?.provider === 'google' ? 'Google' : 'Usuario + PIN'} y sincronizado con Supabase.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: '🔄 Sincronizar Ahora',
          onPress: async () => {
            try {
              await syncCloudVehicles();
              Alert.alert('Sincronización Exitosa', 'Tus placas están al día con la nube de Supabase.');
            } catch {
              Alert.alert('Error', 'No se pudo sincronizar en este momento.');
            }
          },
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas desconectar tu cuenta de este teléfono? Tus vehículos seguirán guardados en tu dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('Sesión Cerrada', 'Tu cuenta se ha desconectado de este dispositivo.');
          },
        },
      ]
    );
  };

  const handleTestAlert = async () => {
    try {
      await sendTestNotification();
    } catch {
      Alert.alert('Aviso', 'Asegúrate de conceder permisos de notificación a la app.');
    }
  };

  const getVehicleIcon = (type: string, color = COLORS.textPrimary) => {
    switch (type) {
      case 'moto':
        return <MotoIcon size={24} color={color} />;
      case 'taxi':
        return <TaxiIcon size={24} color={color} />;
      default:
        return <CarIcon size={24} color={color} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]} edges={['top', 'left', 'right']}>
      <AppBackground />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <View style={styles.titleWithBadgeRow}>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mis Vehículos</Text>
              {isAuthenticated && (
                <TouchableOpacity
                  style={[
                    styles.userBadgePill,
                    {
                      backgroundColor: isDark
                        ? 'rgba(59, 130, 246, 0.18)'
                        : 'rgba(59, 130, 246, 0.12)',
                      borderColor: isDark
                        ? 'rgba(59, 130, 246, 0.4)'
                        : 'rgba(59, 130, 246, 0.3)',
                    },
                  ]}
                  onPress={handleUserOptions}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.userBadgeText, { color: colors.primary }]}>
                    👤 {account?.displayName}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Configura tus placas para recibir alertas automáticas
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleAddVehiclePress()}
            activeOpacity={0.8}
          >
            <PlusIcon size={18} color="#FFF" />
            <Text style={styles.addBtnText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================ */}
        {/* BANNER DE NOTIFICACIONES PROGRAMADAS */}
        {/* ================================================================ */}
        <GlassCard variant="primary" style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={styles.alertIconWrapper}>
              <BellIcon size={20} color={colors.primary} />
            </View>
            <View style={styles.alertInfo}>
              <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>Alertas Automáticas Activas</Text>
              <Text style={[styles.alertDesc, { color: colors.textSecondary }]}>
                Te avisamos a las 7:00 PM del día anterior y a las 6:00 AM el mismo día
                si alguno de tus vehículos tiene Pico y Placa.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.testNotificationBtn, { borderColor: isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(59, 130, 246, 0.25)' }]}
            onPress={handleTestAlert}
            activeOpacity={0.8}
          >
            <Text style={[styles.testNotificationBtnText, { color: colors.primary }]}>
              🔔 Probar Notificación Ahora
            </Text>
          </TouchableOpacity>
        </GlassCard>

        {/* ================================================================ */}
        {/* LISTA DE VEHÍCULOS */}
        {/* ================================================================ */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Vehículos Registrados ({vehicles.length})</Text>
        </View>

        {vehicles.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <CarIcon size={44} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Sin vehículos configurados</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Registra tu vehículo para recibir alertas preventivas y consultar
              tu estado de Pico y Placa en tiempo real.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => handleAddVehiclePress()}
              activeOpacity={0.8}
            >
              <PlusIcon size={18} color="#FFF" />
              <Text style={styles.emptyBtnText}>Registrar mi primer vehículo</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : (
          <View style={styles.vehicleList}>
            {vehicles.map(vehicle => {
              const cityName = cities.find(c => c.id === vehicle.city_id)?.name || 'Colombia';

              return (
                <GlassCard key={vehicle.id} style={styles.vehicleCard}>
                  <View style={styles.vehicleRow}>
                    <View style={styles.vehicleIconCircle}>
                      {getVehicleIcon(vehicle.vehicle_type, COLORS.primary)}
                    </View>

                    <View style={styles.vehicleMainInfo}>
                      <View style={styles.vehicleAliasRow}>
                        <Text style={[styles.vehicleAliasText, { color: colors.textPrimary }]}>{vehicle.alias}</Text>
                        {vehicle.is_favorite && (
                          <View style={styles.favBadge}>
                            <StarIcon size={12} color={colors.accent} filled />
                            <Text style={styles.favBadgeText}>Principal</Text>
                          </View>
                        )}
                        {vehicle.is_exempt && (
                          <View style={styles.exemptBadge}>
                            <Text style={styles.exemptBadgeText}>
                              {vehicle.exemption_type === 'solidario' ? 'Solidario' : 'Exento'}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={[styles.vehiclePlateText, { color: isDark ? '#93C5FD' : colors.primary }]}>
                        {formatPlateDisplay(vehicle.plate)}
                      </Text>

                      <View style={styles.cityLocationRow}>
                        <MapPinIcon size={12} color={colors.textSecondary} />
                        <Text style={[styles.cityLocationText, { color: colors.textSecondary }]}>{cityName}</Text>
                        <Text style={[styles.dotSeparator, { color: colors.textMuted }]}>•</Text>
                        <Text style={[styles.digitPill, { color: colors.textSecondary }]}>
                          Dígito: <Text style={{ color: colors.accent, fontWeight: '800' }}>{vehicle.last_digit}</Text>
                        </Text>
                      </View>
                    </View>

                    {/* Acciones Rápidas */}
                    <View style={styles.vehicleActions}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setFavorite(vehicle.id)}
                        disabled={vehicle.is_favorite}
                      >
                        <StarIcon
                          size={18}
                          color={vehicle.is_favorite ? COLORS.accent : COLORS.textMuted}
                          filled={vehicle.is_favorite}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => openVehicleForm(vehicle)}
                      >
                        <Text style={styles.editActionText}>Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleDelete(vehicle)}
                      >
                        <TrashIcon size={18} color={COLORS.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ================================================================ */}
      {/* MODAL FORMULARIO: AGREGAR / EDITAR VEHÍCULO */}
      {/* ================================================================ */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)',
                paddingBottom: modalBottomPadding,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editingVehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Alias */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Alias / Nombre del vehículo</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(241, 245, 249, 0.95)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Ej. Mi Carro, Spark GT, Moto Negra"
                placeholderTextColor={colors.textMuted}
                value={alias}
                onChangeText={setAlias}
              />

              {/* Placa */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Número de Placa</Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.plateInput,
                  {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : 'rgba(241, 245, 249, 0.95)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
                    color: isDark ? '#93C5FD' : colors.primary,
                  },
                ]}
                placeholder="Ej. ABC123 o XYZ45D"
                placeholderTextColor={colors.textMuted}
                value={plate}
                onChangeText={setPlate}
                autoCapitalize="characters"
                maxLength={7}
              />

              {/* Selector de Tipo de Vehículo */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Tipo de Vehículo</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    {
                      backgroundColor: vehicleType === 'particular'
                        ? colors.primary
                        : isDark
                          ? 'rgba(31, 41, 55, 0.7)'
                          : '#F1F5F9',
                      borderColor: vehicleType === 'particular'
                        ? colors.primary
                        : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(15, 23, 42, 0.08)',
                    },
                  ]}
                  onPress={() => setVehicleType('particular')}
                >
                  <CarIcon
                    size={20}
                    color={vehicleType === 'particular' ? '#FFF' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeBtnText,
                      vehicleType === 'particular'
                        ? styles.typeBtnTextActive
                        : { color: colors.textSecondary },
                    ]}
                  >
                    Carro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    {
                      backgroundColor: vehicleType === 'moto'
                        ? colors.primary
                        : isDark
                          ? 'rgba(31, 41, 55, 0.7)'
                          : '#F1F5F9',
                      borderColor: vehicleType === 'moto'
                        ? colors.primary
                        : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(15, 23, 42, 0.08)',
                    },
                  ]}
                  onPress={() => setVehicleType('moto')}
                >
                  <MotoIcon
                    size={20}
                    color={vehicleType === 'moto' ? '#FFF' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeBtnText,
                      vehicleType === 'moto'
                        ? styles.typeBtnTextActive
                        : { color: colors.textSecondary },
                    ]}
                  >
                    Moto
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    {
                      backgroundColor: vehicleType === 'taxi'
                        ? colors.primary
                        : isDark
                          ? 'rgba(31, 41, 55, 0.7)'
                          : '#F1F5F9',
                      borderColor: vehicleType === 'taxi'
                        ? colors.primary
                        : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(15, 23, 42, 0.08)',
                    },
                  ]}
                  onPress={() => setVehicleType('taxi')}
                >
                  <TaxiIcon
                    size={20}
                    color={vehicleType === 'taxi' ? '#FFF' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeBtnText,
                      vehicleType === 'taxi'
                        ? styles.typeBtnTextActive
                        : { color: colors.textSecondary },
                    ]}
                  >
                    Taxi
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Ciudad */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Ciudad de Circulación Principal</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.cityPillScroll}
              >
                {cities.map(city => (
                  <TouchableOpacity
                    key={city.id}
                    style={[
                      styles.cityPill,
                      {
                        backgroundColor: cityId === city.id
                          ? (isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.12)')
                          : (isDark ? 'rgba(31, 41, 55, 0.7)' : '#F1F5F9'),
                        borderColor: cityId === city.id
                          ? colors.primary
                          : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'),
                      },
                    ]}
                    onPress={() => setCityId(city.id)}
                  >
                    <Text
                      style={[
                        styles.cityPillText,
                        {
                          color: cityId === city.id
                            ? (isDark ? '#93C5FD' : colors.primary)
                            : colors.textSecondary,
                          fontWeight: cityId === city.id ? '700' : '500',
                        },
                      ]}
                    >
                      {city.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Exención Especial */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Exención de Pico y Placa</Text>
              <View style={[styles.switchRow, { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)' }]}>
                <View style={styles.switchTextContainer}>
                  <Text style={[styles.switchTitle, { color: colors.textPrimary }]}>¿Vehículo con Exención Oficial?</Text>
                  <Text style={[styles.switchDesc, { color: colors.textMuted }]}>
                    Aplica para vehículos híbridos, 100% eléctricos o con Pico y Placa Solidario.
                  </Text>
                </View>
                <Switch
                  value={isExempt}
                  onValueChange={setIsExempt}
                  trackColor={{ false: isDark ? '#374151' : '#CBD5E1', true: colors.success }}
                  thumbColor="#FFF"
                />
              </View>

              {isExempt && (
                <View style={styles.exemptionTypeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.exemptionBtn,
                      {
                        backgroundColor: exemptionType === 'electrico_hibrido'
                          ? (isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.12)')
                          : (isDark ? 'rgba(31, 41, 55, 0.65)' : '#F1F5F9'),
                        borderColor: exemptionType === 'electrico_hibrido'
                          ? colors.success
                          : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'),
                      },
                    ]}
                    onPress={() => setExemptionType('electrico_hibrido')}
                  >
                    <Text
                      style={[
                        styles.exemptionBtnText,
                        {
                          color: exemptionType === 'electrico_hibrido'
                            ? (isDark ? '#6EE7B7' : colors.success)
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      🌱 Híbrido / Eléctrico
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.exemptionBtn,
                      {
                        backgroundColor: exemptionType === 'solidario'
                          ? (isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.12)')
                          : (isDark ? 'rgba(31, 41, 55, 0.65)' : '#F1F5F9'),
                        borderColor: exemptionType === 'solidario'
                          ? colors.success
                          : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'),
                      },
                    ]}
                    onPress={() => setExemptionType('solidario')}
                  >
                    <Text
                      style={[
                        styles.exemptionBtnText,
                        {
                          color: exemptionType === 'solidario'
                            ? (isDark ? '#6EE7B7' : colors.success)
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      📄 Pico y Placa Solidario
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Preferencias de Alertas */}
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Recordatorios Automáticos</Text>
              <View style={[styles.switchRow, { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)' }]}>
                <View style={styles.switchTextContainer}>
                  <Text style={[styles.switchTitle, { color: colors.textPrimary }]}>Aviso día anterior (7:00 PM)</Text>
                  <Text style={[styles.switchDesc, { color: colors.textMuted }]}>
                    Para que no olvides dejar el carro en casa mañana.
                  </Text>
                </View>
                <Switch
                  value={notifyPreviousDay}
                  onValueChange={setNotifyPreviousDay}
                  trackColor={{ false: isDark ? '#374151' : '#CBD5E1', true: colors.primary }}
                  thumbColor="#FFF"
                />
              </View>

              <View style={[styles.switchRow, { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)' }]}>
                <View style={styles.switchTextContainer}>
                  <Text style={[styles.switchTitle, { color: colors.textPrimary }]}>Aviso el mismo día (6:00 AM)</Text>
                  <Text style={[styles.switchDesc, { color: colors.textMuted }]}>
                    Alarma temprana antes de salir hacia el trabajo.
                  </Text>
                </View>
                <Switch
                  value={notifySameDay}
                  onValueChange={setNotifySameDay}
                  trackColor={{ false: isDark ? '#374151' : '#CBD5E1', true: colors.primary }}
                  thumbColor="#FFF"
                />
              </View>

              {/* Botón Guardar */}
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <CheckIcon size={20} color="#FFF" />
                <Text style={styles.saveBtnText}>
                  {editingVehicle ? 'Guardar Cambios' : 'Registrar Vehículo'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================================================================ */}
      {/* MODAL: IDENTIFICACIÓN / LOGIN PARA CREAR VEHÍCULO                */}
      {/* ================================================================ */}
      <Modal
        visible={authModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAuthModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
                paddingBottom: modalBottomPadding,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                👤 Tu Cuenta de Vehículos
              </Text>
              <TouchableOpacity
                onPress={() => setAuthModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <Text style={[styles.modalHint, { color: colors.textSecondary }]}>
                Identifícate para guardar tus vehículos en la nube. Si cambias de teléfono o reinstalas la app, solo ingresas tu usuario y se sincronizarán al instante.
              </Text>

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Nombre de Usuario
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : '#F8FAFC',
                    color: colors.textPrimary,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
                  },
                ]}
                placeholder="ej: carlos_manizales"
                placeholderTextColor={colors.textMuted}
                value={authUsername}
                onChangeText={setAuthUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                PIN de 4 dígitos (numérico)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.pinInput,
                  {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : '#F8FAFC',
                    color: colors.textPrimary,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
                  },
                ]}
                placeholder="••••"
                placeholderTextColor={colors.textMuted}
                value={authPin}
                onChangeText={setAuthPin}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary, marginTop: 16 }]}
                onPress={handlePinSubmit}
                activeOpacity={0.85}
                disabled={authSubmitting}
              >
                {authSubmitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <CheckIcon size={20} color="#FFF" />
                    <Text style={styles.saveBtnText}>Ingresar y Continuar</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.modalDividerRow}>
                <View
                  style={[
                    styles.modalDividerLine,
                    { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)' },
                  ]}
                />
                <Text style={[styles.modalDividerText, { color: colors.textMuted }]}>
                  o también
                </Text>
                <View
                  style={[
                    styles.modalDividerLine,
                    { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)' },
                  ]}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.googleModalBtn,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F8FAFC',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)',
                  },
                ]}
                onPress={() => {
                  setAuthModalVisible(false);
                  setGoogleModalVisible(true);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.googleIconText}>🇬</Text>
                <Text style={[styles.googleModalBtnText, { color: colors.textPrimary }]}>
                  Continuar con Cuenta Google
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================================================================ */}
      {/* MODAL: ACCESO CON GOOGLE                                         */}
      {/* ================================================================ */}
      <Modal
        visible={googleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setGoogleModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)',
                paddingBottom: modalBottomPadding,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                🇬 Conectar con Google
              </Text>
              <TouchableOpacity
                onPress={() => setGoogleModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <Text style={[styles.modalHint, { color: colors.textSecondary }]}>
                Vincula tus vehículos a tu cuenta de Google para sincronizarlos en cualquier dispositivo.
              </Text>

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Correo de Google
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : '#F8FAFC',
                    color: colors.textPrimary,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
                  },
                ]}
                placeholder="ej: usuario@gmail.com"
                placeholderTextColor={colors.textMuted}
                value={googleEmail}
                onChangeText={setGoogleEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Nombre o Alias (Opcional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.7)' : '#F8FAFC',
                    color: colors.textPrimary,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)',
                  },
                ]}
                placeholder="ej: Carlos"
                placeholderTextColor={colors.textMuted}
                value={googleName}
                onChangeText={setGoogleName}
              />

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: '#EA4335', marginTop: 20, marginBottom: 8 }]}
                onPress={handleGoogleSubmit}
                activeOpacity={0.85}
                disabled={googleSubmitting}
              >
                {googleSubmitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Vincular con Google</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
    flexShrink: 0,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  alertCard: {
    marginBottom: 20,
    padding: 14,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  alertDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  testNotificationBtn: {
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  testNotificationBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptyCard: {
    paddingVertical: 36,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
  },
  emptyBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  vehicleList: {
    gap: 12,
  },
  vehicleCard: {
    padding: 16,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  vehicleMainInfo: {
    flex: 1,
  },
  vehicleAliasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleAliasText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  favBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    gap: 3,
  },
  favBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
  },
  exemptBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  exemptBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
  },
  vehiclePlateText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#93C5FD',
    marginTop: 2,
    letterSpacing: 1.2,
  },
  cityLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  cityLocationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dotSeparator: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  digitPill: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  vehicleActions: {
    alignItems: 'flex-end',
    gap: 10,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 4,
  },
  editActionText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 22,
    paddingTop: 22,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalCloseBtn: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 14,
  },
  textInput: {
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  plateInput: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#93C5FD',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  typeBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  typeBtnTextActive: {
    color: '#FFF',
  },
  cityPillScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cityPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
  },
  cityPillActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: COLORS.primary,
  },
  cityPillText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  cityPillTextActive: {
    color: '#93C5FD',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 14,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  switchDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  exemptionTypeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  exemptionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(31, 41, 55, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exemptionBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: COLORS.success,
  },
  exemptionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  exemptionBtnTextActive: {
    color: '#6EE7B7',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 10,
    gap: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  titleWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  userBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'center',
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  modalDividerLine: {
    flex: 1,
    height: 1,
  },
  modalDividerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  googleModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginBottom: 8,
  },
  googleModalBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  googleIconText: {
    fontSize: 14,
  },
  modalHint: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10,
  },
  pinInput: {
    fontSize: 22,
    letterSpacing: 6,
    textAlign: 'center',
    fontWeight: '800',
  },
});

export default VehiclesScreen;

