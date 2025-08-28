import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ContactCard from '../components/ContactCard';
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import ExploreCategoriesProducts from '../components/ExploreCategoriesProducts';
import { getCategoryByGroup, getUploadByProduct, getProductsByGroup } from '../services/api';
import CardServicesCategoriesInsideDetailed from '../components/CardServicesCategoriesInsideDetailed';

const OffersByCategory = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();

    const { cat, catName, selectedGroup } = route.params || {};

    const [isLoading, setIsLoading] = useState(true);
    // State para os produtos FILTRADOS que serão exibidos na tela
    const [filteredData, setFilteredData] = useState([]);
    // State para guardar TODOS os produtos buscados da API
    const [allProducts, setAllProducts] = useState([]);
    const [realCategories, setRealCategories] = useState([]);
    // Inicia 'selected' com a categoria que veio da rota ou a primeira da lista
    const [selected, setSelected] = useState(cat);

    // EFEITO 1: Busca os dados brutos (categorias e TODOS os produtos) UMA ÚNICA VEZ.
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!selectedGroup) return;

            try {
                setIsLoading(true);

                // Busca as categorias do grupo
                const categories = await getCategoryByGroup(selectedGroup);
                if (categories.length > 0) {
                    const cats = categories.map(c => ({ categoryData: { cat: c }, uri: '' }));
                    setRealCategories(cats);
                    // Se nenhuma categoria foi passada via params, define a primeira como selecionada
                    if (!cat) {
                        setSelected(categories[0].categoryId);
                    }
                }

                // Busca TODOS os produtos do grupo
                const products = await getProductsByGroup(selectedGroup);
                const productData = [];
                for (const prd of products) {
                    try {
                        const uploadResponse = await getUploadByProduct(prd.id);
                        productData.push({
                            upload: uploadResponse[0] || null,
                            product: prd
                        });
                    } catch (e) {
                        console.warn(`Não foi possível obter a imagem para o produto ${prd.id}`);
                        productData.push({ product: prd, upload: null });
                    }
                }
                // Guarda a lista completa de produtos no state 'allProducts'
                setAllProducts(productData);

            } catch (error) {
                console.error('Erro ao buscar dados iniciais:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [selectedGroup]); // Dependência: executa apenas se o grupo mudar

    // EFEITO 2: Filtra os produtos sempre que a categoria 'selected' ou a lista 'allProducts' mudar.
    useEffect(() => {
        if (!selected) return; // Não faz nada se nenhuma categoria estiver selecionada

        console.log(allProducts)

        // Filtra a lista completa
        const filtered = allProducts.filter(p => {
            // ATENÇÃO: Verifique se 'p.product.categoryId' é o campo correto no seu objeto de produto
            return p.product.category === selected;
        });

        setFilteredData(filtered); // Atualiza os dados que serão exibidos na tela

    }, [selected, allProducts]); // Dependências: executa ao selecionar categoria ou quando os produtos carregam

    const handlePressCard = (uri, clickedPrd) => {
        navigation.navigate('ConciergeDetails', { data: filteredData, clickedImage: uri, clickedProduct: clickedPrd });
    };

    const renderCategoryChip = ({ item }) => (
        <TouchableOpacity
            key={item.categoryData.cat.categoryId}
            style={[
                styles.chip,
                selected === item.categoryData.cat.categoryId && styles.chipSelected
            ]}
            onPress={() => setSelected(item.categoryData.cat.categoryId)}
        >
            <Text style={[
                styles.chipText,
                selected === item.categoryData.cat.categoryId && styles.chipTextSelected
            ]}>
                {item.categoryData.cat.categoryName}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#172B4D" />
                <Text style={styles.loadingText}>{t('offersByCategory.loading')}</Text>
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <GoBackArrow />
                    <Text style={styles.titleText}>
                        {t(catName) || t('offersByCategory.categoryFallback')}
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    <SearchBarHome widthDesired={"90%"} />
                </View>

                <View style={styles.categoriesContainer}>
                    <Text style={styles.categoriesTitle}>Categorias</Text>
                    <ExploreCategoriesProducts
                        data={realCategories}
                        renderItem={renderCategoryChip}
                        flatListStyle={{ height: 56, paddingVertical: 0, backgroundColor: 'transparent' }}
                        flatListContentStyle={{ paddingHorizontal: 0 }}
                    />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.cardsContainer}>
                        {filteredData.length > 0 ? (
                            filteredData.map((prd) => (
                                <TouchableOpacity
                                    key={prd.product.id}
                                    onPress={() => handlePressCard(prd.upload?.filePath, prd)}
                                    style={styles.cardTouchable}
                                >
                                    <CardServicesCategoriesInsideDetailed
                                        title={t(prd.product.name)}
                                        image={prd.upload?.filePath || ""}
                                        description={t(prd.product.description)}
                                    />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t('offersByCategory.noItems')}</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <ContactCard />
        </PaperProvider>
    );
};

// ... (o restante do código, theme e styles, permanece o mesmo)
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
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        position: 'relative',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#172B4D',
        textAlign: 'center',
        flex: 1,
    },
    searchContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
    },
    categoriesContainer: {
        width: '100%',
        marginBottom: 10,
        marginLeft: 20,
        paddingLeft: 10,
    },
    categoriesTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#172B4D',
        marginTop: 10,
        marginBottom: 15,
    },
    chip: {
        backgroundColor: '#F4F6FA',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginRight: 10,
        minWidth: 80,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        elevation: 0,
        shadowOpacity: 0,
    },
    chipSelected: {
        backgroundColor: '#2563EB',
    },
    chipText: {
        color: '#172B4D',
        fontWeight: '500',
        fontSize: 15,
    },
    chipTextSelected: {
        color: '#fff',
    },
    scrollView: {
        width: '100%',
    },
    scrollViewContent: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    cardsContainer: {
        width: '90%',
    },
    cardTouchable: {
        width: '100%',
        marginVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        padding: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
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

export default OffersByCategory;