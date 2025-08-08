import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Ou outro pacote de ícones que você usa
import { useTranslation } from "react-i18next";

const ProfileHandleLanguage = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Ionicons name="language-outline" size={24} color="#0057FF" style={styles.icon} />
            <Text style={styles.text}>{t('Linguagem')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 12,
    },
    text: {
        fontSize: 16,
        color: "#222",
        fontWeight: "500",
    },
});

export default ProfileHandleLanguage;