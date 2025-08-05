import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CardService = ({ title, image }) => (
  <View style={styles.card}>
    <Image source={{ uri: image }} style={styles.image} />
    <View style={styles.overlay}>
      <Text style={styles.title}>{title}</Text>
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
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
  },
});

export default CardService;