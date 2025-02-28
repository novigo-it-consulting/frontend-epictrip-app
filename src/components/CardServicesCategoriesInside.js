import { View, Image, Text, StyleSheet } from "react-native";

const CardServicesCategoriesInside = ({ title, image, description }) => {
  return (
    <View style={styles.serviceCardContainer}>
      <View style={styles.imageWrapper}>
        <Image style={styles.serviceImage} source={{ uri: image }} resizeMode="cover" />
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceCardContainer: {
    width: 450, // Aumentei a largura do card
    marginRight: 32,
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 302, // Aumentei ainda mais a altura da imagem
    borderRadius: 15, // Ajustei o borderRadius para um visual mais suave
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceTitle: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16, // Aumentei o tamanho da fonte do título
    color: '#172B4D',
    marginTop: 10, // Ajustei o espaçamento
    marginLeft: 5,
  },
  serviceDescription: {
    alignSelf: 'flex-start',
    color: '#6C798F',
    fontSize: 14, // Aumentei o tamanho da fonte da descrição
    marginTop: 5,
    marginLeft: 5,
  },
});

export default CardServicesCategoriesInside;