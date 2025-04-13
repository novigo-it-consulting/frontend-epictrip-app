import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const CardServicesCategoriesInside = ({ title, image, description }) => {
  return (
    <View style={styles.serviceCardContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: image }}
          style={styles.serviceImage}
          resizeMode="stretch"  // A imagem preencherá 100% do container
        />
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceCardContainer: {
    width: 160,
    alignItems: 'center',
    marginRight: 16,
  },
  imageWrapper: {
    width: 160,
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceTitle: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#172B4D',
  },
  serviceDescription: {
    marginTop: 5,
    fontSize: 14,
    color: '#6C798F',
    textAlign: 'center',
  },
});

export default CardServicesCategoriesInside;
