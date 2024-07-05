import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../colors';

const DatePickerAge = ({ userData, updateUserData }) => {
  const [date, setDate] = useState(new Date(addOneDay(userData.age)));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setDate(new Date(addOneDay(userData.age)));
  }, [userData.age]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    updateUserData({ ...userData, age: currentDate });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => showMode('date')}>
        <View style={styles.input}>
          <Text style={{ marginLeft: 14 }}>{date.toDateString()}</Text>
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={onChange}
          locale="pt-BR"
        />
      )}
    </View>
  );
};

const addOneDay = (date) => {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate());
  return newDate;
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
});

export default DatePickerAge;
