import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado');
      navigation.replace('ClientTabs');  
    } catch (error) {
      setError('Credenciales incorrectas');
    }
  };


  return (
    <ImageBackground source={require('../assets/logofondo.jpeg')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#ccc"
        />
        
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#ccc"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
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
    backgroundColor: 'rgba(28, 25, 25, 0.6)', // Fondo oscuro para mejorar visibilidad
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  input: { 
    width: '80%', 
    padding: 10, 
    borderBottomWidth: 1, 
    marginBottom: 15, 
    color: 'white', 
    borderBottomColor: 'white' 
  },
  button: { backgroundColor: '#6200EE', padding: 10, borderRadius: 5, width: '80%', alignItems: 'center', marginBottom: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  link: { marginTop: 15, color: '#03DAC6' },
  error: { color: 'red', marginBottom: 10 },
});

export default LoginScreen;
