import { StyleSheet, View, Text } from "react-native";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { expo } from "../../app.json";

const SplashScreen = () => {
  const { navigate } = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("Login");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <LottieView
            style={styles.animation}
            source={require("../../assets/SplashScreen_App (2).json")}
            autoPlay
            loop
          />
        </View>
        <Text
          style={{
            flex: 0.1,
            position: "relative",
            fontWeight: "bold",
            color: "#FFF",
          }}
        >
          v{expo?.version}
        </Text>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0065FF",
    alignItems: "center",
    justifyContent: "center",
  },
  animationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 400,
    height: 900,
  },
});
