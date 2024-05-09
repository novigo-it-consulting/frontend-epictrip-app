// Navigation.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "../screens/SignUpScreen";
import EnterCode from "../screens/EnterCode";
import FogotPassword from "../screens/ForgetPasswordScreen";
import SetNewPassword from "../screens/SetNewPasswordScreen";
import SplashScreen from "../screens/SplashScreen";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="EnterCode"
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="EnterCode" component={EnterCode} />
        <Stack.Screen name="FogotPassword" component={FogotPassword} />
        <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
