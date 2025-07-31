import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking, Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { useTranslation } from 'react-i18next';

const PHONE_NUMBER = '+5511952005261';

const ContactCard = () => {
    const { t } = useTranslation();

    const handleCallPress = async () => {
        const url = `tel:${PHONE_NUMBER}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            Linking.openURL(url);
        } else {
            Alert.alert(t('contactCard.callError'), t('contactCard.callNotSupported'));
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image
                style={styles.profileImage}
            />
            <View style={styles.textContainer}>
                <Text style={styles.roleText}>{t('contactCard.role')}</Text>
                <Text style={styles.nameText}>Courtney Kim</Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <Entypo name="chat" size={24} color="#0065FF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleCallPress}>
                    <Entypo name="phone" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 25,
        backgroundColor: "white",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
        marginBottom: 0,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    roleText: {
        fontSize: 14,
        color: "#6C798F",
    },
    nameText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#172B4D",
    },
    iconContainer: {
        flexDirection: "row",
    },
    iconButton: {
        marginLeft: 10,
        padding: 8,
        backgroundColor: "#E0E0E0",
        borderRadius: 25,
    },
});

export default ContactCard;
