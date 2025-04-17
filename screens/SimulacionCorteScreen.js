import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Button, Text, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FaceDetector from 'expo-face-detector';
import { PanResponder } from 'react-native';

const SimulacionCorteScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });

  const screenWidth = Dimensions.get('window').width; // Obtiene el ancho de la pantalla
  const screenHeight = Dimensions.get('window').height; // Obtiene el alto de la pantalla

  // Elegir imagen desde la galería
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      detectFaces(result.assets[0].uri);
    }
  };

  // Detectar rostro en la imagen
  const detectFaces = async (uri) => {
    try {
      const detection = await FaceDetector.detectFacesAsync(uri, {
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
      });

      console.log('📸 Resultado completo de la detección:', detection);

      if (detection.faces.length > 0) {
        console.log('📸 Rostros detectados:', detection.faces.length);
        setFaceData(detection.faces[0]);
      } else {
        console.log('📸 No se detectó ningún rostro.');
        setFaceData(null);
      }
    } catch (error) {
      console.error('Error al detectar rostros:', error);
    }
  };

  // Obtener dimensiones de la imagen cargada
  useEffect(() => {
    if (imageUri) {
      Image.getSize(imageUri, (width, height) => {
        setImageDimensions({ width, height });
      });
    }
  }, [imageUri]);

  // Manejo de movimientos manuales
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      setOverlayPosition({
        top: gestureState.moveY - 50, // Ajuste de offset
        left: gestureState.moveX - 50, // Ajuste de offset
      });
    },
    onPanResponderRelease: () => {},
  });

  // Función para obtener las dimensiones ajustadas
  const getAdjustedFacePosition = () => {
    if (!faceData) return { top: 0, left: 0, width: 0, height: 0 };

    const { width, height } = imageDimensions;
    const scale = Math.min(screenWidth / width, screenHeight / height); // Escalado uniforme

    const adjustedTop = faceData.bounds.origin.y * scale;
    const adjustedLeft = faceData.bounds.origin.x * scale;
    const adjustedWidth = faceData.bounds.size.width * scale;
    const adjustedHeight = faceData.bounds.size.height * scale;

    return { top: adjustedTop, left: adjustedLeft, width: adjustedWidth, height: adjustedHeight };
  };

  const facePosition = getAdjustedFacePosition();

  return (
    <View style={styles.container}>
      <Button title="Elegir Imagen" onPress={pickImage} />

      {imageUri && (
        <View>
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.image,
              {
                width: imageDimensions.width * Math.min(screenWidth / imageDimensions.width, screenHeight / imageDimensions.height),
                height: imageDimensions.height * Math.min(screenWidth / imageDimensions.width, screenHeight / imageDimensions.height),
              },
            ]}
          />

          {faceData ? (
            <Image
              source={require('../assets/solu.png')} // Imagen del corte
              style={[
                styles.overlay,
                {
                  top: overlayPosition.top || facePosition.top,
                  left: overlayPosition.left || facePosition.left,
                  width: facePosition.width,
                  height: facePosition.height,
                },
              ]}
              {...panResponder.panHandlers} // Habilitar movimiento
            />
          ) : (
            <Text style={styles.warningText}>No se detectó ningún rostro</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { marginVertical: 20 },
  overlay: { position: 'absolute', resizeMode: 'contain' },
  warningText: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default SimulacionCorteScreen;
