import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

// Assumindo que sua função de API está sendo importada corretamente daqui
import { requestGetMethodsByUser } from "../services/api";

// --- DIMENSÕES E LAYOUT ---
// Dimensions ainda é necessário para o snap do carrossel e para calcular a altura do cartão baseada na largura.
const { width: screenWidth } = Dimensions.get("window");

const HORIZONTAL_MARGIN = 16;
const CARD_WIDTH = screenWidth - (HORIZONTAL_MARGIN * 2);

// A altura é metade da largura (aspect ratio = 2).
const CARD_ASPECT_RATIO = 2;
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO;


// --- COMPONENTES AUXILIARES ---

// Componente para o ícone da Visa
const VisaLogo = () => (
    <Text style={styles.visaLogo}>VISA</Text>
);

// Componente para a seta de voltar
const GoBackArrow = () => (
    <TouchableOpacity>
        <Ionicons name="arrow-back" size={24} color="#000" />
    </TouchableOpacity>
);


// --- COMPONENTE PRINCIPAL ---

const WalletScreen = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();
    const route = useRoute();

    // Função para buscar os métodos de pagamento do usuário via API
    const getUserPaymentMethods = async () => {
        try {
            setLoading(true);
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) {
                console.log("ID do usuário não encontrado.");
                setCards([]);
                setLoading(false);
                return;
            }
            // Utiliza a chamada de API real
            const userCards = await requestGetMethodsByUser(userId);

            if (Array.isArray(userCards) && userCards.length > 0) {
                setCards(userCards);
                setSelectedCard(userCards[0].methodId);
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

    // Hook para chamar a função sempre que a tela entrar em foco
    useFocusEffect(
        React.useCallback(() => {
            getUserPaymentMethods();
        }, [route.params?.refresh]) // <-- Adicione dependência do parâmetro refresh
    );

    // Função para lidar com a edição (a ser implementada)
    const handleEditCard = (card) => {
        navigation.navigate("AddCardScreen", { card });
        // Lógica para abrir um modal de edição
    };

    // Renderiza a tela de carregamento
    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0057FF" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Cabeçalho da tela */}
                <View style={styles.header}>
                    <GoBackArrow />
                    <Text style={styles.title}>Wallet</Text>
                </View>

                {/* Mensagem caso não haja cartões */}
                {cards.length === 0 ? (
                    <View style={[styles.noCardsContainer, { height: CARD_HEIGHT + 40 }]}>
                        <Text style={styles.noCardsText}>Nenhum cartão cadastrado.</Text>
                    </View>
                ) : (
                    /* Wrapper do Carrossel de Cartões */
                    <View style={styles.cardCarouselWrapper}>
                        <Animated.ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            snapToAlignment="center"
                            snapToInterval={screenWidth}
                            decelerationRate="fast"
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: false }
                            )}
                            contentContainerStyle={styles.cardScrollContent}
                        >
                            {cards.map((card) => (
                                <View key={card.methodId} style={styles.cardContainer}>
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedCard(card.methodId)}>
                                        <View style={styles.card}>
                                            <View style={styles.cardHeader}>
                                                {/* <VisaLogo /> */}
                                                <TouchableOpacity onPress={() => handleEditCard(card)}>
                                                    <Ionicons name="create-outline" size={24} color="#555" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.cardBody}>
                                                <Text style={styles.cardNumber}>
                                                    •••• •••• •••• {card.cardNumber.slice(-4)}
                                                </Text>
                                            </View>
                                            <View style={styles.cardFooter}>
                                                <View style={styles.cardNameWrapper}>
                                                    <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="tail">{card.cardName}</Text>
                                                </View>
                                                <Text style={styles.cardExp}>{card.cardExpiration}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </Animated.ScrollView>

                        {/* Paginação em pontos */}
                        <View style={styles.pagination}>
                            {cards.map((_, index) => {
                                const inputRange = [
                                    (index - 1) * screenWidth,
                                    index * screenWidth,
                                    (index + 1) * screenWidth,
                                ];
                                const dotOpacity = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [0.3, 1, 0.3],
                                    extrapolate: "clamp",
                                });
                                const dotWidth = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [8, 16, 8],
                                    extrapolate: "clamp",
                                });
                                return (
                                    <Animated.View
                                        key={index}
                                        style={[styles.dot, { opacity: dotOpacity, width: dotWidth }]}
                                    />
                                );
                            })}
                        </View>
                    </View>
                )}


                {/* Botão para adicionar novo cartão */}
                <TouchableOpacity
                    style={styles.addCardButton}
                    onPress={() => navigation.navigate("AddCardScreen")}
                >
                    <Text style={styles.addCardText}>Add new card</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F8F9FA",
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'flex-start',
        paddingVertical: 16,
        paddingHorizontal: '4%', // Usando porcentagem
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#111",
        marginTop: 16,
    },
    cardCarouselWrapper: {
        height: CARD_HEIGHT + 40,
        alignItems: "center",
        marginBottom: 'auto',
    },
    cardScrollContent: {
        alignItems: 'center',
    },
    cardContainer: {
        width: screenWidth,
        paddingHorizontal: '4%', // Usando porcentagem
        justifyContent: "center",
        alignItems: "center"
    },
    card: {
        backgroundColor: "#E9EFFF",
        width: 350, // Ocupa 100% do cardContainer
        height: CARD_HEIGHT,
        borderRadius: 16,
        padding: 20,
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    visaLogo: {
        fontSize: 22,
        fontWeight: '900',
        fontStyle: 'italic',
        color: '#1A1F71',
    },
    cardBody: {
        flex: 1,
        justifyContent: 'center',
    },
    cardNumber: {
        fontSize: 16,
        color: "#343A40",
        letterSpacing: 1,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardNameWrapper: {
        flex: 1,
        marginRight: 10,
    },
    cardName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#212529",
        textTransform: 'uppercase',
    },
    cardExp: {
        fontSize: 14,
        color: "#495057",
    },
    pagination: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "center",
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: "#0057FF",
        marginHorizontal: 4,
    },
    addCardButton: {
        backgroundColor: "#0057FF",
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 40,
        marginHorizontal: '4%', // Usando porcentagem
        shadowColor: "#0057FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    addCardText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    noCardsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '4%', // Usando porcentagem
    },
    noCardsText: {
        fontSize: 18,
        color: '#6c757d'
    }
});

export default WalletScreen;
