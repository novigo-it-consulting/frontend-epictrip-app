import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GoBackArrow from "../components/GoBackArrow";
import { requestGetMethodsByUser } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width: screenWidth } = Dimensions.get("window"); // Largura da tela

const savedCards = [
    {
        id: 1,
        last4: "0123",
        name: "Polina J S Amaro",
        expDate: "12/23",
        cvv: "123",
        number: "4111111111111111",
    },
    {
        id: 2,
        last4: "4567",
        name: "John Doe",
        expDate: "08/24",
        cvv: "456",
        number: "4222222222222222",
    },
    {
        id: 3,
        last4: "7890",
        name: "Jane Smith",
        expDate: "05/25",
        cvv: "789",
        number: "4333333333333333",
    },
];

const WalletScreen = () => {
    const [selectedCard, setSelectedCard] = useState(savedCards[0]?.id || null);
    const [editingCard, setEditingCard] = useState(null);
    const [cards, setCards] = useState(savedCards);
    const scrollX = useRef(new Animated.Value(0)).current;

    const getUserPaymentMethods = async () => {
        const userCards = requestGetMethodsByUser(await AsyncStorage.getItem("userId"));
    }

    useEffect(() => {
        getUserPaymentMethods();
    }, []);

    const handleEditCard = (card) => {
        setEditingCard(card.id);
    };

    const handleSaveCard = (updatedCard) => {
        const updatedCards = cards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
        );
        setCards(updatedCards);
        setEditingCard(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <GoBackArrow />
                    <Text style={styles.title}>Wallet</Text>
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
                        contentContainerStyle={styles.cardScrollContent} // Centraliza os cartões
                    >
                        {cards.map((card) => (
                            <View
                                key={card.id}
                                style={[
                                    styles.cardContainer,
                                    { width: screenWidth - 32 }, // Largura do cartão ajustada à tela
                                ]}
                            >
                                <View style={[styles.card, selectedCard === card.id && styles.selectedCard]}>
                                    {editingCard === card.id ? (
                                        <EditCardForm
                                            card={card}
                                            onSave={handleSaveCard}
                                            onCancel={() => setEditingCard(null)}
                                        />
                                    ) : (
                                        <TouchableOpacity onPress={() => setSelectedCard(card.id)}>
                                            <View style={styles.cardHeader}>
                                                <Ionicons name="card-outline" size={24} color="#6C757D" />
                                                <TouchableOpacity onPress={() => handleEditCard(card)}>
                                                    <Ionicons name="create-outline" size={20} color="#6C757D" />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.cardNumber}>•••• •••• •••• {card.last4} {selectedCard === card.id && <Text style={styles.selectedText}>(selected)</Text>}</Text>
                                            <View style={styles.cardFooter}>
                                                <Text style={styles.cardName}>{card.name}</Text>
                                                <Text style={styles.cardExp}>{card.expDate}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.pagination}>
                        {cards.map((card, index) => {
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
                            return <Animated.View key={card.id} style={[styles.dot, { opacity: dotOpacity }]} />;
                        })}
                    </View>
                </View>

                <TouchableOpacity style={styles.addCardButton}>
                    <Text style={styles.addCardText}>Add new card</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const EditCardForm = ({ card, onSave, onCancel }) => {
    const [name, setName] = useState(card.name);
    const [number, setNumber] = useState(card.number);
    const [expDate, setExpDate] = useState(card.expDate);
    const [cvv, setCvv] = useState(card.cvv);

    const handleSave = () => {
        const updatedCard = {
            ...card,
            name,
            number,
            expDate,
            cvv,
            last4: number.slice(-4),
        };
        onSave(updatedCard);
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={number}
                onChangeText={setNumber}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Expiration Date (MM/YY)"
                value={expDate}
                onChangeText={setExpDate}
            />
            <TextInput
                style={styles.input}
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
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
        alignItems: "center", // Centraliza os cartões horizontalmente
    },
    cardContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#EAF2FF",
        width: "100%", // Ocupa a largura do container
        padding: 16,
        borderRadius: 12,
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
    },
    selectedText: {
        fontSize: 14,
        color: "#0057FF",
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
        backgroundColor: "#D3D3D3",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default WalletScreen;