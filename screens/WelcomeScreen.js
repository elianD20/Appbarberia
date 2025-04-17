import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={require('../assets/logofondo.jpeg')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Image source={require('../assets/logo22.jpeg')} style={styles.logo} />
        <Text style={styles.title}>Bienvenido a BarberShopLuian</Text>
        <Text style={styles.subtitle}>Reserva tu cita fácil y rápido con los mejores barberos.</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(47, 46, 46, 0.5)', // Oscurece un poco el fondo para que el texto sea legible
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  logo: { width: 160, height: 150, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  button: { backgroundColor: '#6200EE', padding: 10, borderRadius: 5, width: '80%', alignItems: 'center', marginBottom: 10 },
  registerButton: { backgroundColor: '#03DAC6' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});

export default WelcomeScreen;
