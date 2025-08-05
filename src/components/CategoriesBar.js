import React from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const categories = [
    { key: 'parks', label: 'Parks' },
    { key: 'shows', label: 'Shows' },
    { key: 'sports', label: 'Sports' },
    { key: 'car', label: 'Car' },
    { key: 'tours', label: 'Tours' },
];

const CategoriesBar = ({ selected, onSelect }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(cat => (
                <TouchableOpacity
                    key={cat.key}
                    style={[
                        styles.chip,
                        selected === cat.key && styles.chipSelected
                    ]}
                    onPress={() => onSelect(cat.key)}
                >
                    <Text style={[
                        styles.chipText,
                        selected === cat.key && styles.chipTextSelected
                    ]}>
                        {cat.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
        marginLeft: 20,
        paddingLeft: 10,
    },
    chip: {
        backgroundColor: '#F4F6FA',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginRight: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#172B4D',
        marginTop: 10,
        marginBottom: 15,
    },
    chipSelected: {
        backgroundColor: '#2563EB',
    },
    chipText: {
        color: '#172B4D',
        fontWeight: '500',
        fontSize: 15,
    },
    chipTextSelected: {
        color: '#fff',
    },
});

export default CategoriesBar;