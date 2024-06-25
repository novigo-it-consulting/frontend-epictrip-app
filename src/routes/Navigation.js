// Navigation.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import HomeTabs from "../components/HomeTabs";
import SignUpScreen from "../screens/SignUpScreen";
import EnterCode from "../screens/EnterCode";
import FogotPassword from "../screens/ForgetPasswordScreen";
import SetNewPassword from "../screens/SetNewPasswordScreen";
import SplashScreen from "../screens/SplashScreen";
import WebView from "../screens/WebViewPage";
import ChangePersonalInfo from "../screens/ChangePersonalInfo";
import EmConstrucaooScreen from "../screens/EmConstrucaooScreen";
import PaymentScreen from "../screens/PaymentScreen";
import ChangePaymentCard from "../screens/ChangePaymentScreen";
import UpdateCard from "../screens/UpdatePaymentScreen";
import Payment from "../screens/Payment";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "#FFFFFF",
          },
        }}
        initialRouteName="SplashScreen"
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="EnterCode" component={EnterCode} />
        <Stack.Screen name="FogotPassword" component={FogotPassword} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen
          name="ChangePaymentScreen"
          component={ChangePaymentCard}
        />
        <Stack.Screen name="UpdateCard" component={UpdateCard} />
        <Stack.Screen
          name="EmConstrucaoScreen"
          component={EmConstrucaooScreen}
        />
        <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
        <Stack.Screen
          name="ChangePersonalInfo"
          component={ChangePersonalInfo}
        />
        <Stack.Screen
          name="Terms"
          component={WebView}
          options={{
            headerShown: true,
            title: "Termos e Condições",
            headerBackTitle: "Voltar",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
