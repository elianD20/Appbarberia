import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const horariosDisponibles = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

const RescheduleScreen = ({ route }) => {
    const { cita } = route.params; // Recibimos la cita a reprogramar
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        setSelectedDate(cita.fecha); // Fecha actual de la cita
        setSelectedTime(cita.hora);  // Hora actual de la cita
    }, [cita]);

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            console.log("Nueva cita:", { fecha: selectedDate, hora: selectedTime });
            // Aquí se enviaría la actualización a Firebase
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reprogramar Cita</Text>
            <Calendar
                current={selectedDate}
                markedDates={{ [selectedDate]: { selected: true, selectedColor: '#6200EE' } }}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                theme={{ selectedDayBackgroundColor: '#6200EE', todayTextColor: '#6200EE' }}
            />
            <Text style={styles.subtitle}>Selecciona un horario:</Text>
            <FlatList
                data={horariosDisponibles}
                keyExtractor={(item) => item}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.timeSlot, selectedTime === item && styles.selectedTime]}
                        onPress={() => setSelectedTime(item)}
                    >
                        <Text style={styles.timeText}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmText}>Confirmar Cambio</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F8F8F8' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10, textAlign: 'center' },
    timeSlot: { flex: 1, padding: 10, margin: 5, backgroundColor: '#E0E0E0', alignItems: 'center', borderRadius: 8 },
    selectedTime: { backgroundColor: '#6200EE' },
    timeText: { fontSize: 16, color: '#000' },
    confirmButton: { marginTop: 20, backgroundColor: '#6200EE', padding: 15, borderRadius: 8, alignItems: 'center' },
    confirmText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default RescheduleScreen;
