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
    width: 160,
    marginRight: 10,
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceTitle: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#172B4D',
    marginTop: 5,
    marginLeft: 5,
  },
  serviceDescription: {
    alignSelf: 'flex-start',
    color: '#6C798F',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default CardServicesCategoriesInside;
