import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';
import { AntDesign } from '@expo/vector-icons';

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'appointments'), where('clienteId', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setAppointments(querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        barberoNombre: docSnap.data().barberoNombre || 'Desconocido',
      })));
    });

    return () => unsubscribe();
  }, []);

  const cancelarCita = async (citaId, barberoId, fecha, hora) => {
    try {
      await updateDoc(doc(db, 'appointments', citaId), { estado: 'Cancelada' });

      const barberoRef = doc(db, 'barberos', barberoId);
      const barberoSnap = await getDoc(barberoRef);
      if (barberoSnap.exists()) {
        const horariosDisponibles = barberoSnap.data().horariosDisponibles || [];
        if (!horariosDisponibles.includes(`${fecha}-${hora}`)) {
          horariosDisponibles.push(`${fecha}-${hora}`);
        }
        await updateDoc(barberoRef, { horariosDisponibles });
      }

      setAppointments((prev) => prev.map((cita) => (cita.id === citaId ? { ...cita, estado: 'Cancelada' } : cita)));
      alert('Cita cancelada');
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
    }
  };

  const eliminarCita = async (citaId) => {
    try {
      await deleteDoc(doc(db, 'appointments', citaId));
      setAppointments((prev) => prev.filter((cita) => cita.id !== citaId));
      alert('Cita eliminada');
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Citas</Text>
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../assets/gif.gif')} style={styles.image} />
          <Text style={styles.noAppointments}>Aún no tienes citas programadas.</Text>
          <TouchableOpacity style={styles.newAppointmentButton} onPress={() => navigation.navigate('NewAppointmentScreen')}>
            <Text style={styles.newAppointmentText}>Agendar una cita</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>📅 {item.fecha} - 🕒 {item.hora}</Text>
              <Text style={styles.text}>💈 Barbero: {item.barberoNombre}</Text>
              <Text style={[styles.statusText, getStatusStyle(item.estado)]}>Estado: {item.estado}</Text>
              {item.estado !== 'Cancelada' && item.estado !== 'Terminada' ? (
                <TouchableOpacity style={styles.cancelButton} onPress={() => cancelarCita(item.id, item.barberoId, item.fecha, item.hora)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarCita(item.id)}>
                  <AntDesign name="delete" size={24} color="white" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewAppointmentScreen')}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const getStatusStyle = (estado) => ({
  fontSize: 16,
  fontWeight: 'bold',
  color: estado === 'Pendiente' || estado === 'agendado' ? '#28a745' : estado === 'Confirmada' ? '#28a745' : '#e74c3c',
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#F8F8F8' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  image: { width: 150, height: 190, marginBottom: 20 },
  noAppointments: { textAlign: 'center', fontSize: 20, color: 'gray' },
  newAppointmentButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 15 },
  newAppointmentText: { color: 'white', fontSize: 16, textAlign: 'center' },
  card: { backgroundColor: '#FFF', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 2 },
  text: { fontSize: 16, marginBottom: 5 },
  statusText: { fontSize: 16, fontWeight: 'bold' },
  buttonText: { color: 'white', fontSize: 16, textAlign: 'center' },
  cancelButton: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 5, marginTop: 10 },
  deleteButton: { backgroundColor: '#ff0000', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default AppointmentsScreen;