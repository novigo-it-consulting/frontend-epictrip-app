import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView // Usei o ScrollView do react-native
} from "react-native";
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProductByCategory, getUploadByProduct } from '../services/api';
import CardServicesCategoriesInsideDetailed from '../components/CardServicesCategoriesInsideDetailed';

const OffersByCategory = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { cat } = route.params || {};
    const { catName } = route.params || {};

    const [isLoading, setIsLoading] = useState(true); // Alterado para true
    const [data, setData] = useState([]);

    const getProducts = async (id) => {
        const data = [];
        const products = await getProductByCategory(id);
        for (const prd of products) {
            const uploadResponse = await getUploadByProduct(prd.id);
            const obj = {
                upload: uploadResponse[0],
                product: prd
            };
            data.push(obj);
        }
        return data;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const products = await getProducts(cat);
                console.log("INFERNOOOOO: ", products);
                setData(products);
            } catch (error) {
                console.error('Erro ao buscar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [cat]);

    const handlePressCard = async (uri, clickedPrd) => {
        navigation.navigate('ConciergeDetails', { data: data, clickedImage: uri, clickedProduct: clickedPrd });
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
                    <Text style={styles.titleText}>{catName || "Categoria"}</Text>
                </View>
                <View style={styles.searchContainer}>
                    <SearchBarHome widthDesired={"90%"} />
                </View>
                <ScrollView style={styles.scrollView}>
                    <View>
                        {data.map((prd) => (
                            <View key={prd.product.id} style={[styles.sectionContainer, { paddingTop: 8 }]}>
                                <TouchableOpacity onPress={() => handlePressCard(prd.upload.filePath, prd)}>
                                    <CardServicesCategoriesInsideDetailed
                                        title={prd.product.name}
                                        image={prd.upload?.filePath || ""} // Verificação segura
                                        description={prd.product.description}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.backGroundLight,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#172B4D',
        marginLeft: 16,
    },
    searchContainer: {
        alignItems: 'center',
        padding: 16,
    },
    scrollView: {
        flex: 1,
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

export default OffersByCategory;