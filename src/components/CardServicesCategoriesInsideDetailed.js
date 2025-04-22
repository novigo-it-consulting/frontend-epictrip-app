import { View, Image, Text, StyleSheet, Platform } from "react-native";

const CardServicesCategoriesInsideDetailed = ({ title, image, description }) => {
  return (
    <View style={styles.serviceCardContainer}>
      <View style={styles.imageWrapper}>
        <Image style={styles.serviceImage} source={{ uri: image }} resizeMode="cover" />
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceCardContainer: {
    width: '100%',
    marginRight: 32,
    alignItems: 'center',
  },
  imageWrapper: {
    width: '90%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: "#FEFEFE",
    paddingBottom: 10, // Espaço para o texto
    ...Platform.select({
      ios: {
        shadowColor: '#172B4D29',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
        shadowColor: '#172B4D29',
      },
    }),
  },
  serviceImage: {
    width: '100%',
    height: 180, // Mantém altura para a imagem
  },
  serviceTitle: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#172B4D',
    marginTop: 8,
    marginHorizontal: 5,
  },
  serviceDescription: {
    alignSelf: 'flex-start',
    color: '#6C798F',
    fontSize: 14,
    marginTop: 5,
    marginHorizontal: 5,
  },
});

export default CardServicesCategoriesInsideDetailed;
