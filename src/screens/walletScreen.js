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
    ActivityIndicator, // Adicionado para o indicador de carregamento
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GoBackArrow from "../components/GoBackArrow";
import { requestGetMethodsByUser } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: screenWidth } = Dimensions.get("window"); // Largura da tela

const WalletScreen = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [editingCard, setEditingCard] = useState(null);
    const [cards, setCards] = useState([]); // Inicializado como array vazio
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
    const scrollX = useRef(new Animated.Value(0)).current;

    // Função para buscar os métodos de pagamento do usuário
    const getUserPaymentMethods = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            const userCards = await requestGetMethodsByUser(userId);

            // Garante que userCards seja um array
            if (Array.isArray(userCards)) {
                setCards(userCards); // Atualiza o estado com os cartões
                if (userCards.length > 0) {
                    setSelectedCard(userCards[0].methodId); // Seleciona o primeiro cartão
                }
            } else {
                console.warn("A API não retornou um array de cartões.");
                setCards([]); // Define cards como array vazio
            }
        } catch (error) {
            console.error("Erro ao buscar métodos de pagamento:", error);
            setCards([]); // Define cards como array vazio em caso de erro
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    // Efeito para buscar os métodos de pagamento ao montar a tela
    useEffect(() => {
        getUserPaymentMethods();
    }, []);

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

    // Se estiver carregando, exibe um indicador de carregamento
    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0057FF" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </SafeAreaView>
        );
    }

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
                        contentContainerStyle={styles.cardScrollContent}
                    >
                        {/* Verifica se cards é um array antes de usar map */}
                        {Array.isArray(cards) && cards.map((card) => (
                            <View
                                key={card.methodId}
                                style={[
                                    styles.cardContainer,
                                    { width: screenWidth - 32 },
                                ]}
                            >
                                <View style={[styles.card, selectedCard === card.methodId && styles.selectedCard]}>
                                    {editingCard === card.methodId ? (
                                        <EditCardForm
                                            card={card}
                                            onSave={handleSaveCard}
                                            onCancel={() => setEditingCard(null)}
                                        />
                                    ) : (
                                        <TouchableOpacity onPress={() => setSelectedCard(card.methodId)}>
                                            <View style={styles.cardHeader}>
                                                <Ionicons name="card-outline" size={24} color="#6C757D" />
                                                <TouchableOpacity onPress={() => handleEditCard(card)}>
                                                    <Ionicons name="create-outline" size={20} color="#6C757D" />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.cardNumber}>•••• •••• •••• {card.cardNumber.slice(-4)} {selectedCard === card.methodId && <Text style={styles.selectedText}>(selected)</Text>}</Text>
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
                        {Array.isArray(cards) && cards.map((card, index) => {
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
                            return <Animated.View key={card.methodId} style={[styles.dot, { opacity: dotOpacity }]} />;
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
    const [name, setName] = useState(card.cardName);
    const [number, setNumber] = useState(card.cardNumber);
    const [expDate, setExpDate] = useState(card.cardExpiration);
    const [cvv, setCvv] = useState(card.cvv);

    const handleSave = () => {
        const updatedCard = {
            ...card,
            cardName: name,
            cardNumber: number,
            cardExpiration: expDate,
            cvv: cvv,
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