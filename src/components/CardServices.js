import { View, Image, Text, StyleSheet } from "react-native"

const CardService = ({ title, image }) => {
  return (
    <View style={styles.serviceCardContainer}>
      <Image style={styles.serviceImage} source={{ uri: image }} />
      <Text style={styles.serviceTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceCardContainer: {
    width: 120,
    marginRight: 10,
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  serviceTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default CardService;
