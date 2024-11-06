import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

const ContactCard = () => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://via.placeholder.com/50' }} // img teste
                style={styles.profileImage}
            />
            <View style={styles.textContainer}>
                <Text style={styles.roleText}>Realtor</Text>
                <Text style={styles.nameText}>Courtney Kim</Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <Entypo name="chat" size={24} color="#0065FF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Entypo name="phone" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 25,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginHorizontal: 0,
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
        color: '#6C798F',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#172B4D',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 10,
        padding: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 25,
    },
});

export default ContactCard;
