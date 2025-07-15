import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    TextInput,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import GoBackArrow from "../components/GoBackArrow";
import { requestGetMethodsByUser } from "../services/api";

const { width: screenWidth } = Dimensions.get("window");

const EditCardForm = ({ card, onSave, onCancel, t }) => {
    const [name, setName] = useState(card.cardName);
    const [number, setNumber] = useState(card.cardNumber);
    const [expDate, setExpDate] = useState(card.cardExpiration);
    const [cvv, setCvv] = useState(card.cvv);

    const handleSave = () => {
        const updatedCard = { ...card, cardName: name, cardNumber: number, cardExpiration: expDate, cvv: cvv };
        onSave(updatedCard);
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder={t('walletScreen.cardholderName')}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder={t('walletScreen.cardNumber')}
                value={number}
                onChangeText={setNumber}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder={t('walletScreen.expDate')}
                value={expDate}
                onChangeText={setExpDate}
            />
            <TextInput
                style={styles.input}
                placeholder={t('walletScreen.cvv')}
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{t('walletScreen.save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>{t('walletScreen.cancel')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const WalletScreen = () => {
    const { t } = useTranslation();
    const [selectedCard, setSelectedCard] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollX = useRef(new Animated.Value(0)).current;

    const getUserPaymentMethods = async () => {
        try {
            setLoading(true);
            const userId = await AsyncStorage.getItem("userId");
            const userCards = await requestGetMethodsByUser(userId);

            if (Array.isArray(userCards)) {
                setCards(userCards);
                if (userCards.length > 0) {
                    setSelectedCard(userCards[0].methodId);
                }
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error("Erro ao buscar métodos de pagamento:", error);
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getUserPaymentMethods();
        }, [])
    );

    const handleEditCard = (card) => {
        setEditingCard(card.methodId);
    };

    const handleSaveCard = (updatedCard) => {
        const updatedCards = cards.map((card) =>
            card.methodId === updatedCard.methodId ? updatedCard : card
        );
        setCards(updatedCards);
        setEditingCard(null);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0057FF" />
                <Text style={styles.loadingText}>{t('walletScreen.loading')}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <GoBackArrow />
                    <Text style={styles.title}>{t('walletScreen.wallet')}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.cardWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        contentContainerStyle={styles.cardScrollContent}
                    >
                        {Array.isArray(cards) && cards.map((card) => (
                            <View
                                key={card.methodId}
                                style={[styles.cardContainer, { width: screenWidth - 32 }]}
                            >
                                <View style={[styles.card, selectedCard === card.methodId && styles.selectedCard]}>
                                    {editingCard === card.methodId ? (
                                        <EditCardForm
                                            card={card}
                                            onSave={handleSaveCard}
                                            onCancel={() => setEditingCard(null)}
                                            t={t}
                                        />
                                    ) : (
                                        <TouchableOpacity onPress={() => setSelectedCard(card.methodId)}>
                                            <View style={styles.cardHeader}>
                                                <Ionicons name="card-outline" size={24} color="#6C757D" />
                                                <TouchableOpacity onPress={() => handleEditCard(card)}>
                                                    <Ionicons name="create-outline" size={20} color="#6C757D" />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.cardNumber}>•••• •••• •••• {card.cardNumber.slice(-4)} {selectedCard === card.methodId && <Text style={styles.selectedText}>{t('walletScreen.selected')}</Text>}</Text>
                                            <View style={styles.cardFooter}>
                                                <Text style={styles.cardName}>{card.cardName}</Text>
                                                <Text style={styles.cardExp}>{card.cardExpiration}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.pagination}>
                        {Array.isArray(cards) && cards.map((_, index) => {
                            const inputRange = [
                                (index - 1) * (screenWidth - 32),
                                index * (screenWidth - 32),
                                (index + 1) * (screenWidth - 32),
                            ];
                            const dotOpacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: "clamp",
                            });
                            return <Animated.View key={index} style={[styles.dot, { opacity: dotOpacity }]} />;
                        })}
                    </View>
                </View>

                <TouchableOpacity style={styles.addCardButton}>
                    <Text style={styles.addCardText}>{t('walletScreen.addNewCard')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    cardWrapper: {
        alignItems: "center",
        marginTop: 20,
    },
    cardScrollContent: {
        alignItems: "center",
    },
    cardContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#EAF2FF",
        width: "100%",
        padding: 16,
        borderRadius: 12,
        minHeight: 150,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: "#0057FF",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardNumber: {
        fontSize: 16,
        marginTop: 10,
        letterSpacing: 2,
    },
    selectedText: {
        fontSize: 14,
        color: "#0057FF",
        fontWeight: "bold",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    cardName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    cardExp: {
        fontSize: 16,
        color: "gray",
    },
    pagination: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#D3D3D3",
        marginHorizontal: 4,
    },
    addCardButton: {
        backgroundColor: "#0057FF",
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 40,
        alignItems: "center",
    },
    addCardText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#D3D3D3",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    saveButton: {
        backgroundColor: "#0057FF",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "#E5E7EB",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#1F2937",
        fontSize: 16,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#0057FF",
    },
});

export default WalletScreen;
