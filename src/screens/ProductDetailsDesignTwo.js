import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

// --- Constantes para facilitar a manutenção ---
const COLORS = {
    white: '#FFFFFF',
    black: '#000000',
    primary: '#007AFF', // Azul do botão principal
    lightGray: '#F0F0F0', // Cinza do fundo do conteúdo
    gray: '#6E6E6E', // Cinza para textos secundários
    darkGray: '#333333', // Cinza escuro para textos principais
    green: '#34C759', // Verde para o status "Open"
    divider: '#E8E8E8', // Cinza claro para as linhas divisórias
};

const SIZES = {
    h1: 26,
    h2: 20,
    h3: 16,
    body: 16,
    caption: 14,
};

const { height: screenHeight } = Dimensions.get('window');
const HEADER_HEIGHT = screenHeight * 0.4; // A imagem ocupa 40% da altura da tela

// --- Componente da Tela ---
const ProductDetailsDesignTwo = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const handleGoBack = () => {
        navigation.goBack();
    };

    const { data, clickedImage, clickedProduct } = route.params || {};

    const navigateChat = async () => {
        navigation.navigate("ChatAmico", { productData: data, clickedProduct: clickedProduct })
    }

    return (
        // Usamos um View como container principal em vez de SafeAreaView para ter controle total
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

            {/* --- Imagem do Topo --- */}
            {/* A imagem é posicionada de forma absoluta no topo da tela */}
            <Image
                source={{ uri: clickedImage }}
                style={styles.headerImage}
            />

            {/* O botão de voltar fica por cima da imagem */}
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            {/* O ScrollView agora ocupa a tela inteira e o conteúdo rola por cima da imagem */}
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* View "espaçadora" para empurrar o conteúdo para baixo, abaixo da área da imagem */}
                <View style={{ height: HEADER_HEIGHT - 50 }} />

                {/* Este é o "card" branco que contém todas as informações */}
                <View style={styles.contentCard}>
                    {/* Seção de Título e Localização */}
                    <View style={styles.titleSection}>
                        <View style={styles.titleAndLocation}>
                            <Text style={styles.mainTitle}>{clickedProduct.product.name}</Text>
                            <View style={styles.locationRow}>
                                <MaterialCommunityIcons name="map-marker" size={16} color={COLORS.gray} />
                                <Text style={styles.locationText}>7007 Sea World Drive, Orlando</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.mapButton}>
                            <MaterialCommunityIcons name="map-outline" size={26} color={COLORS.darkGray} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Seção de Overview */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <Text style={styles.bodyText}>
                            {clickedProduct.product.description}
                        </Text>
                    </View>

                    {/* Seção de Horário */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Hours</Text>
                        <Text style={styles.bodyText}>
                            <Text style={styles.openText}>Open</Text>
                            {'   •   '}
                            Closes 11:00 pm
                        </Text>
                    </View>

                    {/* Seção de Telefone */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Phone</Text>
                        <Text style={styles.bodyText}>+000 123 456-789</Text>
                    </View>

                    <View style={styles.divider} />
                </View>
            </ScrollView>

            {/* --- Rodapé com Botão de Compra --- */}
            {/* O rodapé fica fora do ScrollView para permanecer fixo */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.buyButton} onPress={() => navigateChat()}>
                    <Text style={styles.buyButtonText}>Buy tickets</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray, // Cor de fundo que aparece atrás do card
    },
    headerImage: {
        width: '100%',
        height: HEADER_HEIGHT,
        position: 'absolute',
        top: 0,
    },
    backButton: {
        position: 'absolute',
        // Usamos getStatusBarHeight() para posicionar corretamente em qualquer dispositivo
        top: getStatusBarHeight() + 15,
        left: 20,
        zIndex: 10, // Garante que o botão fique na frente de tudo
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 20,
    },
    // O card branco que contém as informações
    contentCard: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 24,
        // O paddingBottom garante que o último item não fique colado no final
        paddingBottom: 120,
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    titleAndLocation: {
        flex: 1,
        marginRight: 10,
    },
    mainTitle: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: SIZES.caption,
        color: COLORS.gray,
        marginLeft: 5,
    },
    mapButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginHorizontal: 20,
        marginVertical: 16,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: SIZES.caption,
        color: COLORS.gray,
        marginBottom: 8,
    },
    bodyText: {
        fontSize: SIZES.body,
        color: COLORS.darkGray,
        lineHeight: 24,
    },
    readMoreText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    openText: {
        color: COLORS.green,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        paddingBottom: 30, // Espaço extra para o home indicator do iPhone
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
    },
    buyButton: {
        backgroundColor: COLORS.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    buyButtonText: {
        color: COLORS.white,
        fontSize: SIZES.h3,
        fontWeight: 'bold',
    },
});

export default ProductDetailsDesignTwo;