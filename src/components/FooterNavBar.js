import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const FooterNavBar = ({ onPress }) => {
    const navigation = useNavigation();

    const navItems = [
        { name: 'Home', icon: 'home', route: "Home" },
        { name: 'Groups', icon: 'users', route: "EmConstrucaoScreen" },
        { name: 'Requests', icon: 'bell', route: "EmConstrucaoScreen" },
        { name: 'Schedule', icon: 'calendar', route: "EmConstrucaoScreen" },
        { name: 'Profile', icon: 'user', route: "EmConstrucaoScreen" },
    ];

    const handleOnPress = (route) => {
        navigation.navigate(route);
    };

    return (
        <View style={styles.container}>
            {navItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handleOnPress(item.route)}
                >
                    <Icon name={item.icon} size={24} color="#DFE1E5" />
                    <Text style={styles.label}>{item.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopWidth: 3,
        borderTopColor: '#172B4D14',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    button: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        marginTop: 4,
        color: '#DFE1E5',
    },
});

export default FooterNavBar;
