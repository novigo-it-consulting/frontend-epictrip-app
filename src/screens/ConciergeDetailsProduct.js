import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Image, StatusBar, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import ContactCard from '../components/ContactCard';
import GoBackArrow from '../components/GoBackArrow';

const ConciergeDetailsProduct = () => {
    const { t } = useTranslation();
    const route = useRoute();
    const navigation = useNavigation();
    const { clickedImage, clickedProduct } = route.params || {};
    const [input, setInput] = useState('');

    return (
        <>
            <StatusBar barStyle="light-content" />
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: clickedImage }}
                    style={styles.image}
                />
                <View style={styles.goBackWrapper}>
                    <GoBackArrow onPress={() => navigation.goBack()} />
                </View>
            </View>
            <View style={styles.container}>
                <ScrollView
                    style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View style={styles.card}>
                        <View style={styles.handle} />
                        <Text style={styles.title}>{clickedProduct?.name || 'BBQ Grills'}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('') || "Explain what do you need"}
                                placeholderTextColor="#BFC8D9"
                                value={input}
                                onChangeText={setInput}
                                multiline
                            />
                            <TouchableOpacity style={styles.inputIcon}>
                                <Text style={{ fontSize: 20, color: '#BFC8D9' }}>{'>'}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.helperText}>
                            {t('') || "This message will open a request and a chat with your Realtor."}
                        </Text>
                        <TouchableOpacity style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>{t('') || "Submit"}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <ContactCard />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    imageContainer: {
        width: "100%",
        height: 300,
        overflow: 'hidden',
        marginBottom: -50,
        position: 'relative',
        justifyContent: 'flex-start',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    goBackWrapper: {
        position: 'absolute',
        top: 32,
        left: 16,
        zIndex: 2,
        backgroundColor: "#fff",
    },
    card: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
        marginTop: -24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5EAF2',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        color: '#222B45',
    },
    inputContainer: {
        backgroundColor: '#F4F7FA',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 8,
    },
    input: {
        flex: 1,
        minHeight: 120,
        fontSize: 16,
        color: '#222B45',
        paddingRight: 8,
    },
    inputIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    helperText: {
        fontSize: 13,
        color: '#8F9BB3',
        marginBottom: 20,
        marginTop: 2,
    },
    submitButton: {
        backgroundColor: '#0066FF',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default ConciergeDetailsProduct;