import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProblemInput = () => {
  const { t } = useTranslation();
  const [problem, setProblem] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const navigation = useNavigation();

  const navigateChat = async () => {
    await AsyncStorage.setItem("preMessage", problem);
    navigation.navigate("ChatAmico")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('conciergeInput.title')}</Text>
      <View style={[styles.inputContainer, isFocused || problem ? styles.inputContainerFocused : {}]}>
        <Feather name="paperclip" size={18} color="#6e6e6e" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder={t('conciergeInput.placeholder')}
          placeholderTextColor="#aaa"
          value={problem}
          onChangeText={(text) => setProblem(text)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity onPress={() => navigateChat()}>
          <Feather name="send" size={16} color={problem ? "#0066ff" : "#6e6e6e"} style={styles.iconRight} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1c1c',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputContainerFocused: {
    borderColor: '#0066ff',
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  helperText: {
    marginTop: 16,
    fontSize: 12,
    color: '#888',
  },
});

export default ProblemInput;
