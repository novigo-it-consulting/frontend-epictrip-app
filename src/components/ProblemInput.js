import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; 

const ProblemInput = () => {
  const { t } = useTranslation(); 
  const [problem, setProblem] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('problemInput.title')}</Text> 
      <View style={[styles.inputContainer, isFocused || problem ? styles.inputContainerFocused : {}]}>
        <Feather name="paperclip" size={18} color="#6e6e6e" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder={t('problemInput.placeholder')} 
          placeholderTextColor="#aaa"
          value={problem}
          onChangeText={(text) => setProblem(text)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity onPress={() => console.log('Problem submitted:', problem)}>
          <Feather name="send" size={16} color={problem ? "#0066ff" : "#6e6e6e"} style={styles.iconRight} />
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>
        {t('problemInput.helperText')} 
      </Text>
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
