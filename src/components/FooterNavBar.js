import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FooterNavBar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets(); // Pegando safe area do dispositivo

    const navItems = [
        { name: 'Home', icon: 'home', route: "Home" },
        { name: 'Groups', icon: 'users', route: "EmConstrucaoScreen" },
        { name: 'Requests', icon: 'bell', route: "RequestScreen" },
        { name: 'Schedule', icon: 'calendar', route: "EmConstrucaoScreen" },
        { name: 'Profile', icon: 'user', route: "ProfileScreen" },
    ];

    const handleOnPress = (routeName) => {
        if (route.name !== routeName) {
            navigation.navigate(routeName);
        }
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            {navItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handleOnPress(item.route)}
                >
                    <Icon
                        name={item.icon}
                        size={24}
                        color={route.name === item.route ? "#172B4D" : "#6B7280"}
                    />
                    <Text
                        style={[
                            styles.label,
                            route.name === item.route && { color: "#172B4D", fontWeight: "bold" }
                        ]}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderTopWidth: 3,
        borderTopColor: '#E5E7EB',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        width: "100%",
        height: Platform.OS === 'ios' ? 90 : 80, // Ajusta altura para iOS e Android
    },
    button: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        marginTop: 4,
        color: '#6B7280',
    },
});

export default FooterNavBar;
