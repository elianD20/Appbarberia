import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../src/config/firebaseConfig';

const HomeScreen = ({ navigation }) => {
  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'servicios'));
        const serviciosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServicios(serviciosList);
      } catch (error) {
        console.error('Error obteniendo servicios:', error);
      }
    };

    const fetchBarberos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'barberos'));
        const barberosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBarberos(barberosList);
      } catch (error) {
        console.error('Error obteniendo barberos:', error);
      }
    };

    fetchServicios();
    fetchBarberos();
  }, []);

  return (
    <View style={styles.container}>
      {/* Banner de Promociones */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl7K_Mg76IWL-dUaJfeJPNFg3Jfmx5uArUQdfLlZKnpW8o0f0irDDGk4PQzcyOOqpjXvU&usqp=CAU' }}
          style={styles.bannerImage}
        />
      </View>

      {/* Lista de cortes recomendados */}
      <Text style={styles.sectionTitle}>Cortes Recomendados</Text>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('DetailsScreen', { item })}>
            <View style={styles.card}>
              <Image source={{ uri: item.imagen }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.nombre}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Lista de Barberos */}
      <Text style={styles.sectionTitle}>Nuestros Barberos</Text>
      <FlatList
        data={barberos}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('DetailsScreen', { item })}>
            <View style={styles.card}>
              <Image source={{ uri: item.foto }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.nombre}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Botones de acciones */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LocationScreen')}
      >
        <Text style={styles.buttonText}>Nuestra Ubicación</Text>
      </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SimulacionIA')}>
        <Text style={styles.buttonText}>Simular Corte con IA</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8', padding: 15 },
  bannerContainer: { alignItems: 'center', marginBottom: 10 },
  bannerImage: { width: '105%', height: 160, borderRadius: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 10, marginRight: 10, alignItems: 'center' },
  cardImage: { width: 120, height: 120, borderRadius: 100 },
  cardTitle: { textAlign: 'center', marginTop: 5, fontWeight: 'bold' },
  button: { backgroundColor: '#6200EE', padding: 12, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;