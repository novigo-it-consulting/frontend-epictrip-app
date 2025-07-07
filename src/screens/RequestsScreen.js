import React, { useState, useEffect } from "react";
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
import { AlertNotificationRoot } from "react-native-alert-notification";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from "../components/CustomBar";
import { useNavigation } from "@react-navigation/native";
import { getRequestsByUser } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

// Mapeia o status da API para uma chave consistente (não traduzível)
const STATUS_KEYS = {
  OPEN_N1: "inProgress",
  OPEN_N2: "inProgress",
  OPEN_N3: "inProgress",
  SOLVED_N1: "done",
  SOLVED_N2: "done",
  PAYMENT_A: "waitingPayment",
  PAYMENT_D: "paid",
  CLOSED: "unrealized",
};

const STATUS_STYLES = {
  inProgress: { color: "#0057FF", icon: "time-outline" },
  done: { color: "#6C757D", icon: "checkmark-circle-outline" },
  waitingPayment: { color: "#FFA500", icon: "card-outline" },
  paid: { color: "#28A745", icon: "cash-outline" },
  unrealized: { color: "#DC3545", icon: "close-circle-outline" },
};

// Chaves para os filtros, usadas na lógica e para buscar traduções
const FILTER_KEYS = ["all", "inProgress", "done", "waitingPayment", "paid", "unrealized"];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", weekday: "short" };
  return date.toLocaleDateString("en-US", options).replace(",", "");
};

const RequestScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("all"); // Usa a chave, não o texto
  const [loadedRequests, setRequests] = useState([]);

  // 2. Criar um estado para armazenar os textos traduzidos
  const [t, setT] = useState({
    requests: "Requests",
    searchPlaceholder: "Try Disney, Food or Tickets",
    allRequests: "All requests",
    // Textos dos filtros e status
    all: "All",
    inProgress: "In progress",
    done: "Done",
    waitingPayment: "Waiting payment",
    paid: "Paid",
    unrealized: "Unrealized",
  });

  // 3. useEffect para buscar as traduções
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [
          requests, searchPlaceholder, allRequests, all, inProgress,
          done, waitingPayment, paid, unrealized
        ] = await Promise.all([
          translate("Requests", "en"),
          translate("Try Disney, Food or Tickets", "en"),
          translate("All requests", "en"),
          translate("All", "en"),
          translate("In progress", "en"),
          translate("Done", "en"),
          translate("Waiting payment", "en"),
          translate("Paid", "en"),
          translate("Unrealized", "en"),
        ]);
        setT({
          requests, searchPlaceholder, allRequests, all, inProgress,
          done, waitingPayment, paid, unrealized
        });
      } catch (error) {
        console.error("Falha ao buscar traduções:", error);
      }
    };
    fetchTranslations();
  }, []);

  const handleRequestClick = (request) => {
    navigation.navigate("RequestDetailsScreen", { request });
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const requests = await getRequestsByUser(userId);
          setRequests(requests);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests =
    activeFilter === "all"
      ? loadedRequests
      : loadedRequests.filter(
        (request) => STATUS_KEYS[request.status] === activeFilter
      );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={stylesRequests.safeArea}>
        <AlertNotificationRoot>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={stylesRequests.container}
            >
              {/* 4. Usar os textos traduzidos */}
              <View style={stylesRequests.headerView}>
                <Text style={stylesRequests.screenNameText}>{t.requests}</Text>
              </View>

              <View style={stylesRequests.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="gray"
                  style={stylesRequests.searchIcon}
                />
                <TextInput
                  style={stylesRequests.searchInput}
                  placeholder={t.searchPlaceholder}
                  placeholderTextColor="gray"
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={stylesRequests.filterScroll}
              >
                <View style={stylesRequests.filterContainer}>
                  {FILTER_KEYS.map((filterKey, index) => (
                    <TouchableOpacity
                      key={index}
                      style={stylesRequests.filterButton(filterKey === activeFilter)}
                      onPress={() => setActiveFilter(filterKey)}
                    >
                      <Text style={stylesRequests.filterText(filterKey === activeFilter)}>
                        {t[filterKey]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={stylesRequests.requestsHeader}>
                <Text style={stylesRequests.allRequestsText}>{t.allRequests}</Text>
              </View>

              <ScrollView
                style={stylesRequests.requestsScrollView}
                contentContainerStyle={stylesRequests.requestList}
                showsVerticalScrollIndicator={false}
              >
                {filteredRequests.map((request, index) => {
                  const statusKey = STATUS_KEYS[request.status];
                  const statusStyle = STATUS_STYLES[statusKey];
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRequestClick(request)}
                      style={[
                        stylesRequests.requestCard,
                        { borderLeftColor: statusStyle?.color || 'gray' },
                      ]}
                    >
                      <Ionicons
                        name={statusStyle?.icon || 'help-circle-outline'}
                        size={24}
                        color={statusStyle?.color || 'gray'}
                        style={stylesRequests.requestIcon}
                      />
                      <View style={stylesRequests.requestInfo}>
                        <Text style={stylesRequests.requestTitle} numberOfLines={2}>
                          {request.ai_resume}
                        </Text>
                        <Text style={stylesRequests.requestStatus(statusStyle?.color || 'gray')}>
                          {t[statusKey]}
                        </Text>
                        <Text style={stylesRequests.requestDate}>{formatDate(request.created_at)}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="gray" />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </AlertNotificationRoot>
        <CustomTabBar where={"Requests"} />
      </SafeAreaView>
    </PaperProvider>
  );
};

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
    marginTop: 24,
    flexGrow: 0,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingLeft: 8, // Ajuste para alinhar com o conteúdo
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
    paddingBottom: 16,
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
    elevation: 2,
  }),
  filterText: (isActive) => ({
    color: isActive ? "white" : "black",
    fontWeight: "bold",
    fontSize: 14,
  }),
  requestsHeader: {
    marginTop: 8,
    marginBottom: 12,
    paddingLeft: 8, // Ajuste
  },
  allRequestsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  requestsScrollView: {
    flex: 1,
  },
  requestList: {
    paddingBottom: 100,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 4,
    elevation: 3,
    minHeight: 80,
  },
  requestIcon: {
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
    paddingRight: 8,
  },
  requestTitle: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  requestStatus: (color) => ({
    color: color,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  }),
  requestDate: {
    color: "#6B7280",
    fontSize: 12,
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