import React from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const barberiaUbicacion = {
  latitude: 7.115087044755967,
  longitude: -73.10882655629379,
  latitudeDelta: 0.001, // 🔍 Zoom más cercano
  longitudeDelta: 0.002,
};

const LocationScreen = () => {
  const abrirGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${barberiaUbicacion.latitude},${barberiaUbicacion.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ubicación de la Barbería</Text>
      <MapView 
        style={styles.map} 
        initialRegion={barberiaUbicacion}
        showsUserLocation={true} // 🟢 Muestra la ubicación del usuario
        zoomEnabled={true} // ✅ Permite hacer zoom manual
      >
        <Marker coordinate={barberiaUbicacion} title="Barbería" />
      </MapView>
      <Button title="Abrir en Google Maps" onPress={abrirGoogleMaps} color="#6200EE" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  map: { width: '100%', height: 400, borderRadius: 10 },
});

export default LocationScreen;
