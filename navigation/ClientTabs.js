import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LocationScreen from '../screens/LocationScreen';
import SimulacionCorteScreen from '../screens/SimulacionCorteScreen';
import RescheduleScreen from '../screens/RescheduleScreen';
import NewAppointmentScreen from '../screens/NewAppointmentScreen';
import SimulacionIAScreen from '../screens/SimulacionIAScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        <Stack.Screen name="LocationScreen" component={LocationScreen} />
        <Stack.Screen name="SimulacionIA" component={SimulacionIAScreen} />
      </Stack.Navigator>
    );
  }

  function AppointmentsStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppointmentsScreen" component={AppointmentsScreen} />
        <Stack.Screen name="NewAppointmentScreen" component={NewAppointmentScreen} />
        <Stack.Screen name="RescheduleScreen" component={RescheduleScreen} />
      </Stack.Navigator>
    );
}


const ClientTabs = () => {
  return (
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Inicio') {
              iconName = 'home';
            } else if (route.name === 'Citas') {
              iconName = 'calendar';
            } else if (route.name === 'Perfil') {
              iconName = 'person';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200EE',
          tabBarInactiveTintColor: 'gray',
          headerShown: false, // Oculta los headers en cada pantalla
        })}
      >
        <Tab.Screen name="Inicio" component={HomeStack} />
        <Tab.Screen name="Citas" component={AppointmentsStack} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        
      </Tab.Navigator>
    
  );
};

export default ClientTabs;
