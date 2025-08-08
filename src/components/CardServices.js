import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CardService = ({ title, image }) => (
  <View style={styles.card}>
    <Image source={{ uri: image }} style={styles.image} />
    <View style={styles.overlay}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.20)', // leve escurecimento
    paddingBottom: 12,
  },
  titleContainer: {
    backgroundColor: '#F1F5F6',
    borderRadius: 12,
    width: 110, // tamanho fixo para todos
    height: 32, // altura fixa para todos
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#172B4D',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CardService;