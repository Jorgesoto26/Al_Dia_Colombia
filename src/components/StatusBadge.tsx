/**
 * Badge de Estado de Restricción (Semáforo Visual)
 * Al Día Colombia
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

interface StatusBadgeProps {
  label: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  type = 'info',
  size = 'medium',
}) => {
  const getColor = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.25)',
          border: 'rgba(52, 211, 153, 0.65)',
          text: '#6EE7B7',
          dot: '#10B981',
          shadow: 'rgba(16, 185, 129, 0.35)',
        };
      case 'danger':
        return {
          bg: 'rgba(239, 68, 68, 0.28)',
          border: 'rgba(248, 113, 113, 0.65)',
          text: '#FCA5A5',
          dot: '#EF4444',
          shadow: 'rgba(239, 68, 68, 0.35)',
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.25)',
          border: 'rgba(251, 191, 36, 0.65)',
          text: '#FDE68A',
          dot: '#F59E0B',
          shadow: 'rgba(245, 158, 11, 0.35)',
        };
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.25)',
          border: 'rgba(96, 165, 250, 0.65)',
          text: '#93C5FD',
          dot: '#3B82F6',
          shadow: 'rgba(59, 130, 246, 0.35)',
        };
    }
  };

  const colors = getColor();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          paddingVertical: isSmall ? 3 : isLarge ? 8 : 5,
          paddingHorizontal: isSmall ? 8 : isLarge ? 14 : 10,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: isSmall ? 10 : isLarge ? 13 : 11,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;

