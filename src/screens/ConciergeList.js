import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import CardServicesCategoriesInside from '../components/CardServicesCategoriesInside';
import { ScrollView } from 'react-native-gesture-handler';
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
        navigation.navigate('ConciergeDetails', { data: data, clickedImage: uri, clickedProduct: prd });
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
                    <Text style={styles.titleText}>Concierge</Text>
                </View>

                <View style={styles.searchContainer}>
                    <SearchBarHome widthDesired={"90%"} />
                </View>

                <View style={styles.categoriesHeader}>
                    <Text style={styles.categoryText}>Categories</Text>
                </View>

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
                                    style={styles.cardTouchable}
                                >
                                    <CardServicesCategoriesInside
                                        title={prd.product.name}
                                        image={prd.upload.filePath}
                                        description={prd.product.description}
                                    />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Nenhum item encontrado</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
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
        backgroundColor: colors.backGroundLight,
        alignItems: 'center',
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#172B4D',
        marginLeft: 36,
    },
    searchContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
    },
    categoriesHeader: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 8, // reduzido aqui
    },
    categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#172B4D',
    },
    cardsContainer: {
        width: '100%',
        flex: 1,
        marginTop: 0, // evita espaço extra
    },
    scrollViewContent: {
        paddingHorizontal: 8, // cards mais próximos das bordas
        alignItems: 'center',
    },
    cardTouchable: {
        marginHorizontal: 4, // cards mais colados entre si
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
        backgroundColor: colors.backGroundLight,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#172B4D",
    }
});

export default ConciergeList;
