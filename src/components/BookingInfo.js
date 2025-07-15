import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import useMockData from '../data/mockServiceDetails';

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
          // Os títulos e conteúdos agora são traduzidos usando as chaves do mock
          title={t(info.title)}
          style={styles.accordion}
          titleStyle={styles.accordionTitle}
        >
          <Text style={styles.accordionContent}>{t(info.content)}</Text>
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1c',
    marginBottom: 16,
  },
  accordion: {
    marginBottom: 10,
    backgroundColor: "#F1F5F6",
    borderRadius: 12,
  },
  accordionTitle: {
    color: "#172B4D",
    fontWeight: '600',
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default BookingInfo;
