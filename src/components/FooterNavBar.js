import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const FooterNavBar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    // Os itens agora usam chaves de tradução
    const navItems = [
        { nameKey: 'homeTabs.homeButton', icon: 'home', route: "Home" },
        { nameKey: 'homeTabs.groupsButton', icon: 'users', route: "EmConstrucaoScreen" },
        { nameKey: 'homeTabs.requestsButton', icon: 'bell', route: "RequestScreen" },
        { nameKey: 'homeTabs.scheduleButton', icon: 'calendar', route: "ScheduleScreen" },
        { nameKey: 'homeTabs.profileButton', icon: 'user', route: "ProfileScreen" },
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
                        {t(item.nameKey)}
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
        height: Platform.OS === 'ios' ? 90 : 80,
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
