import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig'; // Importamos Firebase Auth y Firestore
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import 'moment/locale/es';
import moment from 'moment';

const NewAppointmentScreen = () => {
  const [barberos, setBarberos] = useState([]);
  const [selectedBarbero, setSelectedBarbero] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedHora, setSelectedHora] = useState(null);
  const navigation = useNavigation();

  // Obtener la lista de barberos desde Firebase
  useEffect(() => {
    const fetchBarberos = async () => {
      const barberosRef = collection(db, 'barberos');
      const snapshot = await getDocs(barberosRef);
      const listaBarberos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBarberos(listaBarberos);
    };
    fetchBarberos();
  }, []);

  // Cargar horarios disponibles cuando se seleccione un barbero o una fecha
  useEffect(() => {
    if (selectedBarbero) {
      fetchCitas();
    }
  }, [selectedBarbero, selectedDate]);

  // Obtener citas del barbero seleccionado para la fecha elegida
  const fetchCitas = async () => {
    const q = query(
      collection(db, 'appointments'),
      where('barberoId', '==', selectedBarbero.id),
      where('fecha', '==', selectedDate.toISOString().split('T')[0]),
      where('estado', '==', 'agendado') // 🔥 Solo citas activas
    );
  
    const snapshot = await getDocs(q);
    const citas = snapshot.docs.map(doc => doc.data());
    generarHorariosDisponibles(citas);
  };
  

  // Generar los horarios disponibles basados en las citas existentes
  const generarHorariosDisponibles = (citas) => {
    const horarioTrabajo = { inicio: 9, fin: 19 };
    const horarios = [];
    for (let i = horarioTrabajo.inicio; i < horarioTrabajo.fin; i++) {
      horarios.push(`${i}:00`);
    }
    const horariosOcupados = citas.map(cita => cita.hora);
    setHorariosDisponibles(horarios.map(hora => ({
      hora,
      disponible: !horariosOcupados.includes(hora)
    })));
  };

  // Guardar la cita en Firebase
  const guardarCita = async () => {
    if (!selectedBarbero || !selectedHora) {
      Alert.alert('Error', 'Por favor selecciona un barbero y una hora');
      return;
    }
  
    try {
      const clienteId = auth.currentUser.uid; // Obtener el ID del usuario autenticado
  
      await addDoc(collection(db, 'appointments'), {
        barberoId: selectedBarbero.id,
        barberoNombre: selectedBarbero.nombre, // Guarda el nombre del barbero
        clienteId: clienteId, // Guardamos el ID del cliente
        fecha: selectedDate.toISOString().split('T')[0],
        hora: selectedHora,
        estado: 'agendado' // Estado inicial de la cita
      });
  
      Alert.alert('Éxito', 'Cita agendada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      Alert.alert('Error', 'No se pudo agendar la cita');
    }
  };
  

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Agendar Cita</Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Selecciona un barbero</Text>
      <FlatList
        data={barberos}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              margin: 5,
              backgroundColor: selectedBarbero?.id === item.id ? '#6200EE' : '#DDD',
              borderRadius: 5,
              alignItems: 'center',
            }}
            onPress={() => setSelectedBarbero(item)}
          >
            <Image source={{ uri: item.foto }} style={{ width: 50, height: 50, borderRadius: 25 }} />
            <Text style={{ color: selectedBarbero?.id === item.id ? 'white' : 'black', marginTop: 5 }}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />

      {selectedBarbero && (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Selecciona una fecha</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text>{moment(selectedDate).locale('es').format('dddd, D [de] MMMM [de] YYYY')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);
                  if (date < hoy) {
                    Alert.alert('Fecha inválida', 'No puedes seleccionar un día que ya pasó.');
                  } else {
                    setSelectedDate(date);
                  }
                }
              }}
            />
          )}

          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Selecciona una hora</Text>
          <FlatList
            data={horariosDisponibles}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  margin: 5,
                  backgroundColor: selectedHora === item.hora ? '#FF6347' : item.disponible ? '#6200EE' : '#CCC',
                  borderRadius: 5,
                  opacity: item.disponible ? 1 : 0.5,
                  alignItems: 'center',
                }}
                disabled={!item.disponible}
                onPress={() => setSelectedHora(item.hora)}
              >
                <Text style={{ color: 'white' }}>{item.hora}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.hora}
          />

          <TouchableOpacity
            style={{
              backgroundColor: '#28A745',
              padding: 15,
              borderRadius: 5,
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={guardarCita}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Confirmar Cita</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default NewAppointmentScreen;
