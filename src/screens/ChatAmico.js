import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import Amiko from "../services/amiko/amiko.js";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoBackArrow from "../components/GoBackArrow.js";
import { requestGetBookingByUser, requestGetHousesByBooking, requestGetUser } from "../services/api";
import { useNavigation, useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const route = useRoute();
  const { productData } = route.params || {};

  const [clientMessage, setClientMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [amikoInstance, setAmikoInstance] = useState(null);
  const [chatState, setChatState] = useState('');
  const scrollViewRef = useRef();

  const buildContext = async () => {
    try {
      let contextString = ""
      let houseDetails = "House Details: House Name: {houseName}, Is condo house: {houseType}, Location: {number} {address}, {neighbourhood}, {City}, {State}, {ZipCode}, {Country}, Maximum Capacity: {maxCapacity}, Pets Allowed: {petsAllowed}, Smoking Allowed: {smokingAllowed}, Parties Allowed: {partiesAllowed}"
      let amenities = "Amenities: Has Pool: {hasPool}, Has Babercue Grill: {hasBabercueGrill}, Has Central Air Conditioner: {hasCentralAirConditioner}, Has Splitter Air Conditioner: {hasSplitterAirConditioner}, Has Dryer: {hasDryer}, Has Washing Machine: {hasWashingMachine}, Has Wi-fi: {hasWiFi}"
      let maxCapacity = "Maximum Guests: {maximumCapacity}, Total Rooms: {totalRooms}, Total Bath Rooms: {totalBathRooms}"
      let travelerDetails = "Traveler Details: Booking Name: {BookingName}, Booking Status: {statusBooking}, Check - In Date: {checkinDate}, Check - Out Date: {checkoutDate}, Traveler Name: {fullName}, Email: {email}, Phone: {phoneNumber}, Share Number: {shareNumber}."
      let offer = "The following is a offer: The product name {productName}. {description}. the severity is {severity}\n\n"

      const bookings = await requestGetBookingByUser(await AsyncStorage.getItem("userId"))
      for (const bk of bookings) {
        if (bk.status === 'Active') {
          const house = await requestGetHousesByBooking(bk.houseId)
          const user = await requestGetUser(await AsyncStorage.getItem("userId"))

          houseDetails = houseDetails.replace("{houseName}", house.houseName)
          houseDetails = houseDetails.replace("{houseType}", house.isCondoHouse)
          houseDetails = houseDetails.replace("{number}", house.number)
          houseDetails = houseDetails.replace("{address}", house.address)
          houseDetails = houseDetails.replace("{neighbourhood}", house.neighbourhood)
          houseDetails = houseDetails.replace("{City}", house.city)
          houseDetails = houseDetails.replace("{State}", house.state)
          houseDetails = houseDetails.replace("{ZipCode}", house.zipCode)
          houseDetails = houseDetails.replace("{Country}", house.country)
          houseDetails = houseDetails.replace("{maxCapacity}", house.maximumCapacity)
          houseDetails = houseDetails.replace("{petsAllowed}", house.petsAllowed)
          houseDetails = houseDetails.replace("{smokingAllowed}", house.smokingAllowed)
          houseDetails = houseDetails.replace("{partiesAllowed}", house.partiesAllowed)

          amenities = amenities.replace("{hasPool}", house.hasPool)
          amenities = amenities.replace("{hasBabercueGrill}", house.hasBabercueGrill)
          amenities = amenities.replace("{hasCentralAirConditioner}", house.hasCentralAirConditioner)
          amenities = amenities.replace("{hasSplitterAirConditioner}", house.hasSplitterAirConditioner)
          amenities = amenities.replace("{hasDryer}", house.hasDryer)
          amenities = amenities.replace("{hasWashingMachine}", house.hasWashingMachine)
          amenities = amenities.replace("{hasWiFi}", house.hasWifi)

          maxCapacity = maxCapacity.replace("{maximumCapacity}", house.maximumCapacity)
          maxCapacity = maxCapacity.replace("{totalRooms}", house.totalRooms)
          maxCapacity = maxCapacity.replace("{totalBathRooms}", house.totalBathRooms)

          travelerDetails = travelerDetails.replace("{BookingName}", bk.bookingName)
          travelerDetails = travelerDetails.replace("{statusBooking}", bk.status)
          travelerDetails = travelerDetails.replace("{checkinDate}", bk.checkIn)
          travelerDetails = travelerDetails.replace("{checkoutDate}", bk.checkOut)
          travelerDetails = travelerDetails.replace("{fullName}", user.fullName)
          travelerDetails = travelerDetails.replace("{email}", user.email)
          travelerDetails = travelerDetails.replace("{phoneNumber}", user.phone)
          travelerDetails = travelerDetails.replace("{shareNumber}", bk.shareNumber)

          let offers = ""; // Nova variável para acumular as ofertas

          for (const prd of productData) {
            // Verifica se prd possui a estrutura esperada
            const name = prd.productData?.product?.name ?? "Nome não disponível";
            const description = prd.productData?.product?.description ?? "Descrição não disponível";
            const severity = prd.productData?.product?.severity ?? "Severidade não disponível";

            // Realiza as substituições na string offer
            let offerPrd = offer.replace("{productName}", name)
              .replace("{description}", description)
              .replace("{severity}", severity);

            // Acumula o resultado em offers
            offers += offerPrd;
          }

          contextString = `${houseDetails}. ${amenities}. ${maxCapacity}. ${travelerDetails}. ${offers}`

          console.log(contextString)

          return contextString
        }
      }
    } catch (error) {
      alert(error)
    }
  }

  const gerarInteiroAleatorio = () => {
    return Math.floor(Math.random() * 1000) + 1;
  }

  useEffect(() => {
    const initializeAmiko = async () => {
      const context = await buildContext();
      setClientMessage(await AsyncStorage.getItem("preMessage"));
      const amiko = new Amiko(`${gerarInteiroAleatorio()}`, context);

      amiko.onChatStateReceived = (newChatState) => {
        console.log("Novo estado do chat recebido:", newChatState);
        setChatState(newChatState);
      };

      amiko.onMessageReceived = (ServerMessageDto) => {
        console.log("Mensagem recebida do servidor:", ServerMessageDto);
        setChatState("");
        if (ServerMessageDto.direction !== 'outgoing') {
          const incomingMessage = {
            id: ServerMessageDto.id,
            type: 'reply',
            content: ServerMessageDto.content,
            createdAt: new Date(ServerMessageDto.createdAt),
          };

          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(msg => msg.id === incomingMessage.id);
            if (!messageExists) {
              console.log("Adicionando nova mensagem:", incomingMessage);
              return [...prevMessages, incomingMessage];
            }
            return prevMessages;
          });
        }
      };

      amiko.onInitMessageList = (initialMessages) => {
        const formattedMessages = initialMessages.map((msg) => ({ from: msg.from, content: msg.content }));
        setMessages(formattedMessages);
      };

      setAmikoInstance(amiko);
    };

    initializeAmiko();

    return () => {
      if (amikoInstance && typeof amikoInstance.destroy === 'function') {
        amikoInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessageToAmiko = (message) => {
    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, { from: 'user', content: message }]);
      amikoInstance?.sendMessage(message, (response) => {
        console.log("Resposta do servidor:", response);
      });
      setClientMessage("");
    }
  };

  return (
    <>
      <SafeAreaView />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
        keyboardVerticalOffset={20}
      >
        <View style={styles.header}>
          <GoBackArrow />
          <View style={styles.userInfo}>
            <Avatar.Image
              size={50}
              source={{ uri: 'https://epictrip-dev.s3.us-east-1.amazonaws.com/profilepics/Imagem+do+WhatsApp+de+2024-11-05+%C3%A0(s)+11.31.07_f195be8e.jpg' }}
            />
            <View>
              <Text style={styles.userName}>Amiko</Text>
              <Text style={styles.userStatus}>Online</Text>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={msg.from === 'user' ? styles.chatBubbleUser : styles.chatBubbleReply}
            >
              <Text style={msg.from === 'user' ? styles.userMessage : styles.replyMessage}>
                {msg.content}
              </Text>
            </View>
          ))}
          {chatState.state === 'composing' ? (
            <Text style={styles.typingIndicator}>Amiko está digitando...</Text>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.textAndSendButtonView}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message"
              mode="outlined"
              outlineColor="transparent"
              outlineStyle={{ borderRadius: 24 }}
              value={clientMessage}
              onChangeText={setClientMessage}
            />
            <Button
              mode="contained"
              onPress={() => sendMessageToAmiko(clientMessage)}
              style={styles.sendButton}
            >
              <Icon name="send" size={24} color="#364764" />
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  userStatus: {
    fontSize: 12,
    color: 'green',
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#0065FF',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
  },
  userMessage: {
    color: '#FFFFFF',
  },
  chatBubbleReply: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F6',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
  },
  replyMessage: {
    color: '#000',
  },
  typingIndicator: {
    marginVertical: 5,
    fontStyle: 'italic',
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  textAndSendButtonView: {
    height: '100%',
    width: 342,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F1F5F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  textInput: {
    flex: 0.8,
    marginRight: 10,
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: '#F1F5F6',
  },
  sendButton: {
    borderRadius: 20,
    height: '100%',
    flex: 0.25,
    backgroundColor: '#F1F5F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    paddingLeft: 10,
  },
});

export default ChatScreen;