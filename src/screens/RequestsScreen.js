import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import GoBackArrow from "../components/GoBackArrow";
import { AlertNotificationRoot } from "react-native-alert-notification";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from "../components/CustomBar";
import { useNavigation } from "@react-navigation/native";

const RequestScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("All");

  const handleRequestClick = (request) => {
    alert("opora")
    navigation.navigate("RequestDetailsScreen", { request });
  }

  const STATUS_MAPPING = {
    OPEN_N1: "In progress",
    OPEN_N2: "In progress",
    OPEN_N3: "In progress",
    SOLVED_N1: "Done",
    SOLVED_N2: "Done",
    PAYMENT_A: "Waiting payment",
    PAYMENT_D: "Paid",
    CLOSED: "Unrealized",
  };

  const STATUS_COLORS = {
    "OPEN_N1": "#0057FF",
    "OPEN_N2": "#0057FF",
    "OPEN_N3": "#0057FF",
    "SOLVED_N1": "#6C757D",
    "SOLVED_N2": "#6C757D",
    "PAYMENT_A": "#FFA500",
    "PAYMENT_D": "#28A745",
    "CLOSED": "#DC3545",
  };

  const STATUS_ICONS = {
    "OPEN_N1": "time-outline",
    "OPEN_N2": "time-outline",
    "OPEN_N3": "time-outline",
    "SOLVED_N1": "checkmark-circle-outline",
    "SOLVED_N2": "checkmark-circle-outline",
    "PAYMENT_A": "card-outline",
    "PAYMENT_D": "cash-outline",
    "CLOSED": "close-circle-outline",
  };

  const filteredRequests = activeFilter === "All"
    ? requests
    : requests.filter(request => request.status === activeFilter);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={stylesRequests.safeArea}>
        <AlertNotificationRoot>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={stylesRequests.container}
            >
              <View style={stylesRequests.headerView}>
                <Text style={stylesRequests.screenNameText}>Requests</Text>
              </View>

              <View style={stylesRequests.searchContainer}>
                <Ionicons name="search" size={20} color="gray" style={stylesRequests.searchIcon} />
                <TextInput
                  style={stylesRequests.searchInput}
                  placeholder="Try Disney, Food or Tickets"
                  placeholderTextColor="gray"
                />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={stylesRequests.filterScroll}>
                <View style={stylesRequests.filterContainer}>
                  {[
                    "All",
                    "In progress",
                    "Done",
                    "Waiting payment",
                    "Paid",
                    "Unrealized",
                  ].map((filter, index) => (
                    <TouchableOpacity
                      key={index}
                      style={stylesRequests.filterButton(filter === activeFilter)}
                      onPress={() => setActiveFilter(filter)}
                    >
                      <Text style={stylesRequests.filterText(filter === activeFilter)}>{filter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={stylesRequests.allRequestsText}>All requests</Text>

              <ScrollView contentContainerStyle={stylesRequests.requestList}>
                {filteredRequests.map((request, index) => (
                  <TouchableOpacity key={index} onPress={() => handleRequestClick(request)} style={[stylesRequests.requestCard, { borderLeftColor: request.color }]}>
                    <Ionicons name={request.icon} size={24} color={request.color} style={stylesRequests.requestIcon} />
                    <View style={stylesRequests.requestInfo}>
                      <Text style={stylesRequests.requestTitle}>{request.title}</Text>
                      <Text style={stylesRequests.requestStatus(request.color)}>{STATUS_MAPPING[request.status]}</Text>
                      <Text style={stylesRequests.requestDate}>{request.date}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="gray" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </AlertNotificationRoot>
        <CustomTabBar />
      </SafeAreaView>
    </PaperProvider>
  );
};

const requests = [
  { title: "Pool maintenance", status: "SOLVED_N1", date: "Jun 24, Thu", color: "gray", icon: "hammer" },
  { title: "BBQ Grill", status: "PAYMENT_A", date: "Jun 24, Thu", color: "blue", icon: "home" },
  { title: "Condo access", status: "OPEN_N1", date: "Jun 24, Thu", color: "blue", icon: "home" },
  { title: "Booking number", status: "SOLVED_N2", date: "Jun 24, Thu", color: "gray", icon: "document-text" },
  { title: "Extend booking", status: "CLOSED", date: "Jun 24, Thu", color: "red", icon: "alert-circle" },
];


const stylesRequests = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterScroll: {
    marginTop: 16,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  screenNameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEFF2",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  filterButton: (isActive) => ({
    backgroundColor: isActive ? "#0057FF" : "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 32,
    shadowOffset: { height: 1 },
  }),
  filterText: (isActive) => ({
    color: isActive ? "white" : "black",
    fontWeight: "bold",
  }),
  allRequestsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  requestList: {
    marginTop: 10,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginVertical: 6,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { height: 1 },
    borderLeftWidth: 4,
  },
  requestIcon: {
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontWeight: "bold",
  },
  requestStatus: (color) => ({
    color: color,
  }),
  requestDate: {
    color: "gray",
  },
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

export default RequestScreen;
