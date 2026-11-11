/**
 * Al Día Colombia - Entry Point
 * Aplicación móvil utilitaria con Soporte Dual Nativo (Oscuro Original & Claro Fondo Blanco)
 */
import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { VehicleProvider } from './src/context/VehicleContext';
import { FuelProvider } from './src/context/FuelContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import mobileAds from 'react-native-google-mobile-ads';

function MainApp(): React.JSX.Element {
  const { isDark, colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.(colors.statusBar, true);
      (StatusBar as any).setTranslucent?.(false);
    }

    // Inicialización oficial de Google Mobile Ads (AdMob)
    mobileAds()
      .initialize()
      .catch(() => {});
  }, [colors.statusBar]);

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <VehicleProvider>
        <FuelProvider>
          <AppNavigator />
        </FuelProvider>
      </VehicleProvider>
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
