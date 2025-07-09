import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import useMockData from '../data/mockServiceDetails';
import { translate } from "../services/translations/translateServices";

const BookingInfo = () => {
  const { bookingInfo } = useMockData();

  // 1. Criar um estado para armazenar o título traduzido
  const [title, setTitle] = useState("Booking Information");

  // 2. useEffect para buscar a tradução
  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const translatedTitle = await translate("Booking Information", "en");
        setTitle(translatedTitle);
      } catch (error) {
        console.error("Falha ao traduzir o título:", error);
      }
    };
    fetchTranslation();
  }, []);

  if (!bookingInfo || !Array.isArray(bookingInfo)) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* 3. Usar o estado com o texto traduzido */}
      <Text style={styles.label}>{title}</Text>
      {bookingInfo.map((info, index) => (
        <List.Accordion
          key={index}
          title={info.title} // Assumindo que este título já vem no idioma correto do mock
          style={styles.accordion}
        >
          <Text style={styles.acordionContent}>{info.content}</Text>
        </List.Accordion>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 16,
  },
  accordion: {
    marginBottom: 10,
    backgroundColor: "#F1F5F6",
    color: "#172B4D",
    borderRadius: 12,
  },
  acordionContent: {
    marginBottom: 10,
    padding: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1c1c',
    marginBottom: 16,
  },
});

export default BookingInfo;