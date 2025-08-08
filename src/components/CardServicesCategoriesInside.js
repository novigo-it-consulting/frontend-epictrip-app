import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
// NOVO: Importe o componente de ícone
import Icon from 'react-native-vector-icons/Ionicons';

const CardServicesCategoriesInside = ({ title, image, description }) => {
  return (
    <View style={styles.serviceCardContainer}>
      <Image
        source={{ uri: image }}
        style={styles.serviceImage}
        resizeMode="stretch"
      />
      <View style={styles.textCard}>
        <Text style={styles.serviceTitle}>{title}</Text>

        {/* NOVO: Bloco para exibir o endereço mockado */}
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={16} color="#5E6C84" />
          <Text style={styles.addressText}>7007 Sea World Drive, Orlando</Text>
        </View>

        {/* <Text style={styles.serviceDescription}>{description}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceCardContainer: {
    width: 342,
    height: 232,
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textCard: {
    width: 328,
    alignItems: "flex-start",
  },
  serviceImage: {
    width: 326,
    height: 128,
    borderRadius: 8,
    marginTop: 8,
  },
  serviceTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#172B4D',
  },
  // NOVO: Estilos para o container de localização
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  // NOVO: Estilo para o texto do endereço
  addressText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#5E6C84',
  },
  serviceDescription: {
    marginTop: 5,
    fontSize: 14,
    color: '#6C798F',
    textAlign: 'left',
  },
});

export default CardServicesCategoriesInside;