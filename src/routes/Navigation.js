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
import ChatAmico from "../screens/ChatAmico";
import EmConstrucaooScreen from "../screens/EmConstrucaooScreen";
import PaymentScreen from "../screens/PaymentScreen";
import ChangePaymentCard from "../screens/ChangePaymentScreen";
import UpdateCard from "../screens/UpdatePaymentScreen";
import Payment from "../screens/Payment";
import PaymentSelectedCard from "../screens/PaymentSelectedCard";
import BookingScreen from "../screens/BookingScreen";
import BookingDetails from "../screens/BookingDetails";
import ExperienceScreen from "../screens/Experience";
import ServiceDetails from "../screens/ServiceDetails";
import ServicesScreen from "../screens/ServiceScreen";
import ConciergeDetails from "../screens/ConciergeDetails";
import ConciergeList from "../screens/ConciergeList";
import HomeScreen from "../screens/HomeScreen";
import OffersList from "../screens/OffersList";
import OffersByCategory from "../screens/OffersByCategory";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();

const noGestureScreenOptions = {
  gestureEnabled: false,
};

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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={noGestureScreenOptions}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={noGestureScreenOptions} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={noGestureScreenOptions} />
        <Stack.Screen name="OffersList" component={OffersList} options={noGestureScreenOptions} />
        <Stack.Screen name="EnterCode" component={EnterCode} options={noGestureScreenOptions} />
        <Stack.Screen name="FogotPassword" component={FogotPassword} options={noGestureScreenOptions} />
        <Stack.Screen name="SetNewPassword" component={SetNewPassword} options={noGestureScreenOptions} />
        <Stack.Screen name="ChangePersonalInfo" component={ChangePersonalInfo} options={noGestureScreenOptions} />
        <Stack.Screen name="ChatAmico" component={ChatAmico} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="ServiceScreen" component={ServicesScreen} />
        <Stack.Screen name="OffersByCategory" component={OffersByCategory} />
        <Stack.Screen
          name="Terms"
          component={WebView}
          options={{
            headerShown: true,
            title: "Termos e Condições",
            headerBackTitle: "Voltar",

          }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={noGestureScreenOptions} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} options={noGestureScreenOptions} />
        <Stack.Screen name="ChangePaymentScreen" component={ChangePaymentCard} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} options={noGestureScreenOptions} />
        <Stack.Screen name="UpdateCard" component={UpdateCard} />
        <Stack.Screen name="EmConstrucaoScreen" component={EmConstrucaooScreen} options={noGestureScreenOptions} />
        <Stack.Screen name="PaymentSelectedCard" component={PaymentSelectedCard} options={noGestureScreenOptions} />
        <Stack.Screen name="ExperienceScreen" component={ExperienceScreen} options={noGestureScreenOptions} />
        <Stack.Screen name="ConciergeDetails" component={ConciergeDetails} options={noGestureScreenOptions} />
        <Stack.Screen name="ConciergeList" component={ConciergeList} options={noGestureScreenOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
