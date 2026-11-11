/**
 * Modal Selector Rápido de Ciudad
 * Al Día Colombia
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { City } from '../types/database.types';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../theme/colors';
import { CheckIcon, CloseIcon, MapPinIcon } from './Icons';

interface CityPickerModalProps {
  visible: boolean;
  cities: City[];
  selectedCityId: string;
  onSelect: (city: City) => void;
  onClose: () => void;
}

export const CityPickerModal: React.FC<CityPickerModalProps> = ({
  visible,
  cities,
  selectedCityId,
  onSelect,
  onClose,
}) => {
  const { isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === 'android';
  const bottomPadding = isAndroid
    ? Math.max(insets.bottom, 48) + 16
    : Math.max(insets.bottom, 24) + 12;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} activeOpacity={1} />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)',
              paddingBottom: bottomPadding,
            },
          ]}
        >
          {/* Header del Modal */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <MapPinIcon size={20} color={colors.primary} />
              <Text style={[styles.title, { color: colors.textPrimary }]}>Seleccionar Ciudad</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Elige la ciudad para consultar las restricciones y normas de Pico y Placa.
          </Text>

          {/* Lista de Ciudades */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {cities.map(city => {
              const isSelected = city.id === selectedCityId;
              return (
                <TouchableOpacity
                  key={city.id}
                  style={[
                    styles.cityItem,
                    {
                      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.55)' : '#F8FAFC',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)',
                    },
                    isSelected && styles.cityItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(city);
                    onClose();
                  }}
                  activeOpacity={0.75}
                >
                  <View style={styles.cityInfo}>
                    <Text
                      style={[
                        styles.cityName,
                        { color: isSelected ? (isDark ? '#93C5FD' : colors.primary) : colors.textPrimary },
                      ]}
                    >
                      {city.name}
                    </Text>
                    {city.department ? (
                      <Text style={[styles.cityDept, { color: colors.textSecondary }]}>{city.department}</Text>
                    ) : null}
                  </View>

                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <CheckIcon size={14} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  list: {
    maxHeight: 380,
  },
  listContent: {
    gap: 8,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(31, 41, 55, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cityItemSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderColor: COLORS.primary,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  cityNameSelected: {
    color: '#93C5FD',
  },
  cityDept: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CityPickerModal;

