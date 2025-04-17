import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setNewName(userDoc.data().nombre);
          setNewPhone(userDoc.data().celular);
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    if (!newName || !newPhone) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    try {
      const userRef = doc(db, 'usuarios', auth.currentUser.uid);
      await updateDoc(userRef, { nombre: newName, celular: newPhone });
      setUserData({ ...userData, nombre: newName, celular: newPhone });
      setEditing(false);
      alert('Perfil actualizado con éxito.');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <Text style={styles.label}>Nombre:</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={newName}
          onChangeText={setNewName}
        />
      ) : (
        <Text style={styles.info}>{userData?.nombre}</Text>
      )}

      <Text style={styles.label}>Celular:</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={newPhone}
          onChangeText={setNewPhone}
          keyboardType="phone-pad"
        />
      ) : (
        <Text style={styles.info}>{userData?.celular}</Text>
      )}

      <Text style={styles.label}>Correo Electrónico:</Text>
      <Text style={styles.info}>{userData?.email}</Text>

      {editing ? (
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#bbb',
    alignSelf: 'flex-start',
  },
  info: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    width: '100%',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
