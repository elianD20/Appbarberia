import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../src/config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
      if (!name || !phone || !email || !password) {
        Alert.alert("Error", "Todos los campos son obligatorios.");
        return;
      }
    
      if (password.length < 8) {
        Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
        return;
      }
    
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
          nombre: name,
          celular: phone,
          email,
          rol: "cliente",  
        });

        Alert.alert("Éxito", "Registro exitoso.");
        navigation.navigate("Login");
      } catch (error) {
        let mensajeError = "Error al registrar usuario.";
        
        if (error.code === "auth/email-already-in-use") {
          mensajeError = "Este correo ya está registrado.";
        } else if (error.code === "auth/invalid-email") {
          mensajeError = "El correo electrónico no es válido.";
        } else if (error.code === "auth/weak-password") {
          mensajeError = "La contraseña es demasiado débil.";
        }

        Alert.alert("Error", mensajeError);
      }
    };

    return (
      <ImageBackground 
        source={require('../assets/logofondo.jpeg')}  // Imagen de fondo
        style={styles.background}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registro</Text>

          <TextInput 
            placeholder="Nombre completo" 
            placeholderTextColor="#DDD" 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
          />
          <TextInput 
            placeholder="Número de celular" 
            placeholderTextColor="#DDD" 
            style={styles.input} 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="phone-pad" 
          />
          <TextInput 
            placeholder="Correo electrónico" 
            placeholderTextColor="#DDD" 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
          />
          <TextInput 
            placeholder="Contraseña" 
            placeholderTextColor="#DDD" 
            style={styles.input} 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", 
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "rgba(15, 14, 14, 0.6)", // Fondo semitransparente SOLO en el formulario
    padding: 20,
    borderRadius: 10,
    width: "85%", 
    alignItems: "center",
  },
  title: { fontSize: 27, fontWeight: 'bold', color: "white", marginBottom: 20 },
  input: { 
    width: '100%', 
    padding: 10, 
    borderBottomWidth: 1, 
    marginBottom: 15, 
    color: "white", 
    borderBottomColor: "white" 
  },
  button: { 
    backgroundColor: '#6200EE', 
    padding: 10, 
    borderRadius: 5, 
    width: "100%", 
    alignItems: "center", 
    marginTop: 10 
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  link: { marginTop: 15, color: '#03DAC6' },
});

export default RegisterScreen;
