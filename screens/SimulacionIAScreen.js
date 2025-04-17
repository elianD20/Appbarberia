import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getAccessToken,
  uploadImage,
  getHairStyleOptions,
  simulateHaircut,
  getSimulationResult,
  getStylesByGroupId,
} from "../src/config/youcamApi";

const SimulacionIAScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [simulatedImage, setSimulatedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [styleGroups, setStyleGroups] = useState([]);
  const [selectedStyleGroup, setSelectedStyleGroup] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [styleList, setStyleList] = useState([]);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getAccessToken();
      if (token) setAccessToken(token);
    };
    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchStyleGroups = async () => {
      if (accessToken) {
        const groups = await getHairStyleOptions(accessToken);
        setStyleGroups(groups || []);
        setSelectedStyleGroup(groups?.[0] || null);
      }
    };
    fetchStyleGroups();
  }, [accessToken]);

  useEffect(() => {
    if (selectedStyleGroup && accessToken) {
      getStylesByGroupId(selectedStyleGroup.id, accessToken)
        .then((styles) => {
          setStyleList(styles || []);
          setSelectedStyle(styles?.[0] || null);
        })
        .catch(() => {
          setStyleList([]);
          setSelectedStyle(null);
        });
    } else {
      setStyleList([]);
      setSelectedStyle(null);
    }
  }, [selectedStyleGroup, accessToken]);

  const traducirEstilo = (nombre) => {
    const traducciones = {
      "Buzz Cut": "Corte al ras",
      "Pompadour": "Tupé",
      "Undercut": "Rapado lateral",
      "Fade": "Degradado",
      "Crew Cut": "Corte militar",
      "Side Part": "Peinado de lado",
      "Quiff": "Tupé moderno",
      "Mohawk": "Mohicano",
      "Mullet": "Mullet",
      "Comb Over": "Peinado con raya",
    };
    return traducciones[nombre] || nombre;
  };

  const handleSimulation = async () => {
    if (!selectedImage || !accessToken || !selectedStyleGroup || !selectedStyle) {
      alert("Selecciona una imagen y un estilo de cabello.");
      return;
    }
    setLoading(true);
    try {
      const uploadedFileId = await uploadImage(selectedImage, accessToken);
      if (uploadedFileId) {
        const generatedTaskId = await simulateHaircut(
          uploadedFileId,
          selectedStyleGroup.id,
          selectedStyle.id,
          accessToken
        );
        if (generatedTaskId) {
          const resultUrl = await getSimulationResult(generatedTaskId, accessToken);
          setSimulatedImage(resultUrl);
        }
      }
    } catch (error) {
      alert("Error en la simulación.");
    } finally {
      setLoading(false);
    }
  };

  const renderStyleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.styleItem}
      onPress={() => setSelectedStyle(item)}
    >
      {item.info?.thumb ? (
        <Image source={{ uri: item.info.thumb }} style={styles.styleImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <Text style={styles.styleTitle}>{traducirEstilo(item.info?.title)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simulación IA - Cortes de cabello</Text>

      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Grupo de Estilos:</Text>
        <Picker
          selectedValue={selectedStyleGroup?.id || null}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedStyleGroup(styleGroups.find((group) => group.id === itemValue));
          }}
        >
          {styleGroups.map((group) => (
            <Picker.Item key={group.id} label={group.info?.title || "Desconocido"} value={group.id} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={styleList}
        renderItem={renderStyleItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        style={styles.styleGrid}
      />

      <TouchableOpacity style={styles.button} onPress={handleSimulation} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Simulando..." : "Simular Corte"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#FF6347" />}
      {simulatedImage && <Image source={{ uri: simulatedImage }} style={styles.image} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#ffffff", padding: 20 },
  title: { fontSize: 22, color: "#000", fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#FF6347", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  image: { width: 200, height: 200, borderRadius: 10, marginTop: 15 },
  pickerContainer: { width: "80%", marginBottom: 15 },
  pickerLabel: { color: "#000", fontSize: 16, marginBottom: 5 },
  picker: { backgroundColor: "#ddd", color: "#000" },
  styleGrid: { marginTop: 10 },
  styleItem: { alignItems: "center", margin: 5 },
  styleImage: { width: 100, height: 100, borderRadius: 8 },
  styleTitle: { color: "#000", marginTop: 5 },
  placeholderImage: { width: 100, height: 100, backgroundColor: "#ccc", borderRadius: 8 },
});

export default SimulacionIAScreen;
