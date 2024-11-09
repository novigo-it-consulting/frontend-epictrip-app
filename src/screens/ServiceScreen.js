import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import SearchBarHome from '../components/SearchViewHome';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import CardService from '../components/CardServices';
import GoBackArrow from '../components/GoBackArrow';


const ServicesScreen = () => {
  const navigation = useNavigation();


  const { t } = useTranslation();

  const handleServicePress = (serviceId, serviceTitle) => {
    navigation.navigate('ServiceDetails', { serviceId, serviceTitle });
  };


  return (
    <>
      <SafeAreaView />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcons}>
            <GoBackArrow />
            <Text style={styles.title}>Services</Text>
          </View>
        </View>
        <SearchBarHome />
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Access</Text>
            <ScrollView horizontal>
              <TouchableOpacity onPress={() => handleServicePress(1, 'Condo')}>
                <CardService
                  title="Condo"
                  image="https://img.freepik.com/fotos-premium/praia-da-ilha-de-cantor-em-palm-beach-florida-us_79295-5856.jpg?w=996"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(2, 'Home')}>
                <CardService
                  title="Home"
                  image="https://img.freepik.com/fotos-premium/jardim-com-vegetacao-natural-com-muitas-arvores-e-piscina-que-cria-uma-atmosfera-harmoniosa_949060-902.jpg?w=996"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(3, 'Wifi')}>
                <CardService
                  title="Wifi"
                  image="https://img.freepik.com/fotos-gratis/switch-de-rede-com-cabos_1137-6.jpg?t=st=1731096726~exp=1731100326~hmac=aad259303f56d41b37660fe419f2156bce98466be9854df07bf86135a067ba01&w=996"
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manutenção</Text>
            <ScrollView horizontal>
              <TouchableOpacity onPress={() => handleServicePress(4, 'Air Cond')}>
                <CardService
                  title="Air Cond"
                  image="https://img.freepik.com/fotos-gratis/mulher-jovem-usando-tecnologia-domestica_23-2149216631.jpg?t=st=1731096824~exp=1731100424~hmac=432e3c5f902ea33e2eb32d72bffc4cae482371c40cea2be6bb50a0ca3259641b&w=360"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(5, 'Electrics')}>
                <CardService
                  title="Electrics"
                  image="https://img.freepik.com/fotos-premium/reparador-de-conexoes-wi-fi_151013-1519.jpg?w=996"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(6, 'Hydro')}>
                <CardService
                  title="Hydro"
                  image="https://img.freepik.com/fotos-premium/encanador-que-fixa-o-tubo-da-pia-com-uma-chave-ajustavel_34936-2978.jpg?w=996"
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cleaning</Text>
            <ScrollView horizontal>
              <TouchableOpacity onPress={() => handleServicePress(7, 'Home')}>
                <CardService
                  title="Home"
                  image="https://img.freepik.com/fotos-premium/jardim-com-vegetacao-natural-com-muitas-arvores-e-piscina-que-cria-uma-atmosfera-harmoniosa_949060-902.jpg?w=996"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(8, 'Pool')}>
                <CardService
                  title="Pool"
                  image="https://img.freepik.com/fotos-premium/trabalhador-de-limpeza-de-piscina-ao-ar-livre-com-vacuo-subaquatico_495423-32387.jpg?w=360"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleServicePress(9, 'Yard')}>
                <CardService
                  title="Yard"
                  image="https://img.freepik.com/fotos-premium/um-homem-com-um-ancinho-pega-folhas-outono-paisagem-dourado-outono_93200-4627.jpg?w=996"
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 10
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "#172B4D",
    textAlign: "center",
    width: "100%",
    marginLeft: -80,
    color: "#172B4D"
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ServicesScreen;