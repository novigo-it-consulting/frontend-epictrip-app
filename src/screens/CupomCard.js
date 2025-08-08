import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const CupomCard = ({
    title = "McDonald's",
    address = "7007 Sea World Drive, Orlando",
    discount = "15% OFF"
}) => (
    <View style={styles.container}>

        <Feather name="arrow-left" size={24} color="#1c1c1c" style={styles.backIcon} />
        <Text style={styles.title}>Coupon</Text>
        <View style={styles.qrContainer}>
            <QRCode
                value="https://meusite.com"
                size={200}
            />
        </View>
        <Text style={styles.place}>{title}</Text>
        <View style={styles.addressRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
            <Text style={styles.address}>{address}</Text>
        </View>
        <Button mode="contained" style={styles.discountBtn} labelStyle={styles.discountLabel}>
            {discount}
        </Button>
        <View style={styles.infoRow}>
            <Feather name="info" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
                This is a single use code for your use only. Get a new code each time you shop with EpicTrip.
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 150, // Alterado de 32 para 80
        backgroundColor: '#fff',
    },
    backIcon: {
        position: 'absolute',
        top: 66, // Alterado de 24 para 36
        left: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1c1c1c',
        marginTop: -8, // Subiu o título
        marginBottom: 24,
        alignSelf: 'flex-start',
        marginLeft: 16,
    },
    qrContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 24,
        marginTop: 56, // Aumentado para descer mais o QR Code
    },
    qrImage: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
    },
    place: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1c1c1c',
        marginTop: 8,
        marginBottom: 2,
        textAlign: 'center',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    address: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    discountBtn: {
        backgroundColor: '#22C55E',
        borderRadius: 20,
        paddingHorizontal: 24,
        marginVertical: 12,
        elevation: 0,
    },
    discountLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 32,
        marginHorizontal: 16,
    },
    infoText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 6,
        flex: 1,
        textAlign: 'left',
    },
});

export default CupomCard;