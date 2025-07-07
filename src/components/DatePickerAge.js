import React from 'react';
import { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../colors';
// 1. Importar o serviço de tradução
import { translate } from '../services/translations/translateServices';

/**
 * Adiciona um dia à data.
 * Isso é útil para corrigir problemas de fuso horário (timezone),
 * onde a data pode ser exibida como o dia anterior.
 */
const addOneDayToFixTimezone = (dateString) => {
  const newDate = new Date(dateString);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
}

const DatePickerAge = ({ userData, updateUserData }) => {
  const [date, setDate] = useState(addOneDayToFixTimezone(userData.age));
  const [show, setShow] = useState(false);
  // 2. Criar estado para o texto traduzido, com "Birthdate" como valor inicial
  const [birthdateLabel, setBirthdateLabel] = useState('Birthdate');

  // useEffect para buscar a tradução do label
  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const translatedText = await translate('Birthdate', 'en'); // Assumindo tradução do inglês
        setBirthdateLabel(translatedText);
      } catch (error) {
        console.error("Falha ao traduzir 'Birthdate':", error);
        // Se a tradução falhar, o texto original 'Birthdate' será mantido.
      }
    };

    fetchTranslation();
  }, []); // Array vazio [] garante que a tradução seja buscada apenas uma vez

  // useEffect para atualizar a data se ela mudar externamente
  useEffect(() => {
    setDate(addOneDayToFixTimezone(userData.age));
  }, [userData.age]);

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      updateUserData({ ...userData, age: selectedDate });
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatePicker}>
        <View style={styles.input}>
          {/* 3. Usar o estado com o texto traduzido */}
          <Text style={styles.label}>{birthdateLabel}</Text>

          {!show && (
            <Text style={styles.dateText}>
              {date.toLocaleDateString("pt-BR")}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          style={{ marginRight: "auto" }}
          mode="date"
          is24Hour={false}
          display="default"
          onChange={onChange}
          locale="pt-BR"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
    width: "100%",
  },
  input: {
    width: "100%",
    justifyContent: "center",
  },
  label: {
    marginBottom: 14,
    marginTop: 16
  },
  dateText: {
    textAlign: "left",
  }
});

export default DatePickerAge;