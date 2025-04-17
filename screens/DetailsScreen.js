import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { item } = route.params; // Recibimos los datos del corte o barbero

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.imagen || item.foto || item.urlImagen }} style={styles.image} />
      <Text style={styles.title}>{item.nombre}</Text>
      {item.precio && <Text style={styles.price}>💰 Precio: ${item.precio}</Text>}
      <Text style={styles.description}>{item.descripcion}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 50, alignItems: 'center', backgroundColor: '#F8F8F8' },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#6200EE', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center' },
});

export default DetailsScreen;
