import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List } from 'react-native-paper'; 
import useMockData from '../data/mockServiceDetails';
import { useTranslation } from 'react-i18next';

const BookingInfo = () => {

  const { bookingInfo } = useMockData();

  const { t } = useTranslation();

  if (!bookingInfo || !Array.isArray(bookingInfo)) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('bookingInfo.titlePage')}</Text>
      {bookingInfo.map((info, index) => (
        <List.Accordion
          key={index}
          title={info.title}
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
