import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../colors';
import { Divider } from 'react-native-paper';

const DatePickerAge = ({ userData, updateUserData }) => {
  const [date, setDate] = useState(new Date());
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
    <View style={{marginLeft: 12, width: "100%"}}>
      <TouchableOpacity onPress={() => showMode('date')}>
        <View style={styles.input}>
          <Text style={{marginBottom: 14, width: "100%",  textAlign: "left", marginTop: 16}}>Data de Nascimento</Text>
          <Text style={{ width: "100%",  textAlign: "left", marginTop: 0, display: show ? "none" :"block"}}>{date.toLocaleDateString("pt-BR")}</Text>
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          style={{marginRight: "auto"}}
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
    width: "300%",
    display: "flex", 
    justifyContent: "center", 
    flexDirection: "column", 
    alignContent: "center", 
    alignItems: "center",
    textAlign: "left",  
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
});

export default DatePickerAge;
