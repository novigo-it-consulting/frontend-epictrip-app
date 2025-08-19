import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Image
} from "react-native";
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import { ScrollView } from 'react-native-gesture-handler';
import ContactCard from '../components/ContactCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProductsByGroup, getUploadByProduct } from '../services/api';

const ConciergeList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params || {};

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getProducts = async () => {
        try {
            let prds = [];
            const products = await getProductsByGroup(group);

            for (const product of products) {
                try {
                    const upload = await getUploadByProduct(product.id);
                    const obj = {
                        product: product,
                        upload: upload[0]
                    };
                    prds.push(obj);
                } catch (error) {
                    console.warn(`Erro ao obter imagem para o produto ${product.id}:`, error);
                }
            }
            return prds;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const products = await getProducts();
                setData(products);
            } catch (error) {
                console.error('Erro ao buscar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePressCard = async (uri, prd) => {
        navigation.navigate('ConciergeDetailsProduct', { data: data, clickedImage: uri, clickedProduct: prd });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#172B4D" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <GoBackArrow />
                </View>
                <Text style={styles.titleText}>Concierge</Text>

                <View style={styles.searchContainer}>
                    <SearchBarHome
                        widthDesired={"100%"}
                        placeholder="Try Disney, Food or Tickets"
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                    />
                </View>

                <Text style={styles.categoryText}>Categories</Text>

                {/* ScrollView vertical apenas na área dos produtos */}
                <ScrollView style={styles.verticalScroll} contentContainerStyle={styles.verticalScrollContent}>
                    <View style={styles.cardsContainer}>
                        <ScrollView
                            horizontal
                            contentContainerStyle={styles.scrollViewContent}
                            showsHorizontalScrollIndicator={false}
                        >
                            {data.length > 0 ? (
                                data.map((prd) => (
                                    <TouchableOpacity
                                        key={prd.product.id}
                                        onPress={() => handlePressCard(prd.upload.filePath, prd)}
                                        style={styles.imageCardTouchable}
                                        activeOpacity={0.85}
                                    >
                                        <View style={styles.imageCard}>
                                            <Image
                                                source={{ uri: prd.upload.filePath }}
                                                style={styles.image}
                                                resizeMode="cover"
                                            />
                                            <Text style={styles.imageTitle}>{prd.product.name}</Text>
                                            <Text style={styles.imageDescription}>{prd.product.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Nenhum item encontrado</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </ScrollView>
                <ContactCard />
            </SafeAreaView>
        </PaperProvider>
    );
};

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
    },
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'flex-start',
        paddingTop: Platform.OS === "android" ? 30 : 0,
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 0,
        marginBottom: 0,
    },
    titleText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#172B4D',
        marginLeft: 16,
        marginTop: 54,
        marginBottom: 0,
        letterSpacing: -0.5,
    },
    searchContainer: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 25,
        marginBottom: 0,
    },
    searchBar: {
        borderRadius: 16,
        backgroundColor: "#F6F8FB",
        height: 44,
        justifyContent: "center",
    },
    searchInput: {
        fontSize: 15,
        color: "#172B4D",
    },
    categoryText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#172B4D',
        marginLeft: 16,
        marginTop: 30,
        marginBottom: 8,
    },
    verticalScroll: {
        flex: 1,
        width: '100%',
    },
    verticalScrollContent: {
        paddingBottom: 16,
    },
    cardsContainer: {
        width: '100%',
        marginTop: 0,
    },
    scrollViewContent: {
        paddingLeft: 12,
        paddingRight: 0,
        alignItems: 'flex-start',
    },
    imageCardTouchable: {
        marginRight: 16,
        marginLeft: 0,
    },
    imageCard: {
        width: 170,
        alignItems: 'flex-start',
    },
    image: {
        width: 170,
        height: 200,
        borderRadius: 16,
        backgroundColor: "#eee",
    },
    imageTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#172B4D",
        marginTop: 8,
        marginLeft: 2,
        marginBottom: 0,
    },
    imageDescription: {
        fontSize: 12,
        color: "#7A869A",
        marginLeft: 2,
        marginBottom: 6,
        marginTop: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: "#172B4D",
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#172B4D",
    }
});

export default ConciergeList;