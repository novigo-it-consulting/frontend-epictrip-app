import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity
} from "react-native";
import colors from "../colors";
import SearchBarHome from '../components/SearchViewHome';
import GoBackArrow from '../components/GoBackArrow';
import CardServicesCategoriesInside from '../components/CardServicesCategoriesInside';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';


const ConciergeList = () => {

    const navigation = useNavigation();

    const categoriesList = [
        {
            title: 'BBQ Grills',
            uri: 'https://img.freepik.com/fotos-gratis/mao-de-alto-angulo-segurando-a-ferramenta-de-churrasco_23-2149412525.jpg?t=st=1731089516~exp=1731093116~hmac=415c868e8bcf49a515b6d289333e0f8026a146159755210af52a0d948dc87c62&w=996',
            description: 'Many sizes and kits'
        },
        {
            title: 'Strollers',
            uri: 'https://img.freepik.com/fotos-gratis/jovem-mae-andando-com-carrinho-de-bebe-no-parque_1303-23189.jpg?t=st=1731089579~exp=1731093179~hmac=8256d578e43fa840bdab484ac41c5a1f5bb49864990c705e1046a27150d0b94c&w=996',
            description: 'Many sizes and colors'
        }
    ];


    const categoriesList2 = [
        {
            title: 'Rent Hyper Cars',
            uri: 'https://img.freepik.com/fotos-gratis/carros-esporte-desfile-ou-corrida-na-estrada_114579-4052.jpg?t=st=1731091215~exp=1731094815~hmac=e90353ab4cb725aad0403f1c1741ba87371abf446538a016d195c8c940fc9572&w=900',
            description: 'Drive your dreams'
        },
        {
            title: 'Home Cleaning',
            uri: 'https://img.freepik.com/fotos-gratis/tiro-medio-da-empregada-domestica-profissional-limpando-o-vaso-de-flor_1098-19064.jpg?t=st=1731089673~exp=1731093273~hmac=0896e9544624c08c41a3c3a25a734da64caa46aafd2ddea91605f853508af71f&w=360',
            description: 'Aks for extra cleaning'
        }
    ];

    const handlePressCard = async (uri) => {
        await AsyncStorage.setItem('conciergeUri', uri)
        navigation.navigate('ConciergeDetails')
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
                        {categoriesList.map((cat, index) => (
                            <TouchableOpacity onPress={() => (handlePressCard(cat.uri))}>
                                <CardServicesCategoriesInside key={index} title={cat.title} image={cat.uri} description={cat.description} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.containerCategoryCards}>
                    <ScrollView horizontal style={styles.scrollView}>
                        {categoriesList2.map((cat, index) => (
                            <TouchableOpacity onPress={() => (handlePressCard(cat.uri))}>
                                <CardServicesCategoriesInside key={index} title={cat.title} image={cat.uri} description={cat.description} />
                            </TouchableOpacity>
                        ))}
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
    containerBackButton: {
        justifyContent: "space-around",
        alignItems: "flex-start",
        padding: '7%',
        flexDirection: "column",
        flex: 0.1,
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
        display: 'flex'
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
});

export default ConciergeList;
