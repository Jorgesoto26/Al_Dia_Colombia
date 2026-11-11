/**
 * Navegación Principal: Glassmorphic Bottom Tab Bar
 * Al Día Colombia
 */
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TodayScreen } from '../screens/today/TodayScreen';
import { VehiclesScreen } from '../screens/vehicles/VehiclesScreen';
import { FuelScreen } from '../screens/fuel/FuelScreen';
import { CalendarScreen } from '../screens/calendar/CalendarScreen';
import { IndicatorsScreen } from '../screens/indicators/IndicatorsScreen';
import { BottomBannerAd } from '../components/ads';
import {
  CarIcon,
  CalendarIcon,
  SettingsIcon,
  BellIcon,
  FuelIcon,
  DollarIcon,
} from '../components/Icons';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  const { isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === 'android';
  // En Android con barra física o virtual de 3 botones (Atrás, Inicio, Recientes), la barra mide ~48dp.
  // Si insets.bottom devuelve 0 o un valor menor a 48dp, garantizamos un piso seguro de 48dp
  // para que los iconos y etiquetas nunca queden detrás de los botones del teléfono.
  const bottomInset = isAndroid
    ? Math.max(insets.bottom, 48)
    : Math.max(insets.bottom, 24);
  const tabBarHeight = 58 + bottomInset;

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => (
          <View style={styles.tabBarWrapper}>
            <BottomBannerAd />
            <BottomTabBar {...props} />
          </View>
        )}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: colors.tabBarBackground,
              borderTopColor: colors.tabBarBorder,
              height: tabBarHeight,
              paddingBottom: bottomInset,
            },
          ],
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
        }}
      >
        <Tab.Screen
          name="Hoy"
          component={TodayScreen}
          options={{
            tabBarLabel: 'Hoy',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActiveContainer]}>
                <CarIcon size={22} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Vehículos"
          component={VehiclesScreen}
          options={{
            tabBarLabel: 'Vehículos',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActiveContainer]}>
                <BellIcon size={21} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Combustibles"
          component={FuelScreen}
          options={{
            tabBarLabel: 'Gasolina',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActiveContainer]}>
                <FuelIcon size={21} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Calendario"
          component={CalendarScreen}
          options={{
            tabBarLabel: 'Festivos',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActiveContainer]}>
                <CalendarIcon size={21} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Indicadores"
          component={IndicatorsScreen}
          options={{
            tabBarLabel: 'Economía',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActiveContainer]}>
                <DollarIcon size={21} color={color} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    width: '100%',
  },
  tabBar: {
    backgroundColor: 'rgba(20, 23, 32, 0.96)',
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1.2,
    paddingTop: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  iconContainer: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  iconActiveContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.45)',
  },
});

export default AppNavigator;

