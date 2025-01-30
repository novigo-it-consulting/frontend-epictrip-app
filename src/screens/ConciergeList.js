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
import AsyncStorage from "@react-native-async-storage/async-storage";
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
                        productData: {
                            product
                        },
                        imageUrl: upload[0]?.filePath // Evita erro caso `filePath` não exista
                    };
                    console.log(obj)
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
                const products = await getProducts(); // Agora `getProducts()` retorna os produtos corretamente
                setData(products);
            } catch (error) {
                console.error('Erro ao buscar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePressCard = async (uri) => {
        navigation.navigate('ConciergeDetails', { data: data, clickedImage: uri });
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
                <View style={styles.textContainerTitle}>
                    <GoBackArrow />
                    <Text style={styles.titleText}>Concierge</Text>
                </View>
                <View style={styles.centeredViews}>
                    <SearchBarHome widthDesired={"90%"} />
                </View>
                <View style={styles.centeredViews}>
                    <View style={styles.textContainer}>
                        <Text style={styles.categoryText}>Categories</Text>
                    </View>
                </View>
                <View style={styles.containerCategoryCards}>
                    <ScrollView horizontal style={styles.scrollView}>
                        {data.length > 0 ? (
                            data.map((prd) => (
                                <TouchableOpacity key={prd.productData.product.id} onPress={() => handlePressCard(prd.imageUrl)}>
                                    <CardServicesCategoriesInside
                                        title={prd.productData.product.name}
                                        image={prd.imageUrl}
                                        description={prd.productData.product.description}
                                    />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ padding: 20, color: "#172B4D" }}>Nenhum item encontrado</Text>
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
    },
    scrollView: {
        flexGrow: 1,
        alignSelf: 'stretch',
        backgroundColor: colors.backGroundLight
    },
    centeredViews: {
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        alignItems: 'flex-start',
        width: '100%',
        padding: '7%',
        paddingTop: '10%',
    },
    textContainerTitle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '67%',
        padding: '7%',
        color: '#172B4D',
        justifyContent: 'space-between',
    },
    categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#172B4D'
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#172B4D'
    },
    containerCategoryCards: {
        alignItems: 'flex-start',
        padding: '7%',
        paddingTop: '1%',
        flexDirection: 'row',
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
