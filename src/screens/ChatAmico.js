import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import Amiko from "../services/amiko/amiko.js";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoBackArrow from "../components/GoBackArrow.js";
import { requestGetBookingByUser, requestGetHousesByBooking, requestGetUser, getAddressById, createFirstRequest } from "../services/api";
import { useNavigation, useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const route = useRoute();
  const { productData } = route.params || {};
  const { clickedProduct } = route.params || {};

  const [clientMessage, setClientMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [amikoInstance, setAmikoInstance] = useState(null);
  const [chatState, setChatState] = useState('');
  const scrollViewRef = useRef();

  const buildContext = async () => {
    try {
      if (clickedProduct === 'a531dd1d-6b90-4fd1-a2e5-0e9e795288e3') {
        const newRequestClaim = await createFirstRequest(
          await AsyncStorage.getItem("userId"),
          clickedProduct.product?.id || "a531dd1d-6b90-4fd1-a2e5-0e9e795288e3"
        );

        let requestNumberClaim = "The opened request id is {request_id}";
        let travelerDetailsClaim = "Traveler Details: Booking Name: {BookingName}, Booking Status: {statusBooking}, Check - In Date: {checkinDate}, Check - Out Date: {checkoutDate}, Person Name:{fullName}, Person Id:{userId}, Email: {email}, Phone: {phoneNumber}, Share Number: {shareNumber}.";

        const userClaim = await requestGetUser(await AsyncStorage.getItem("userId"));
        const bookingClaims = await requestGetBookingByUser(await AsyncStorage.getItem("userId"));

        if (bookingClaims && bookingClaims.length > 0) {
          travelerDetailsClaim = travelerDetailsClaim
            .replace("{BookingName}", bookingClaims[0].bookingName || "N/A")
            .replace("{statusBooking}", bookingClaims[0].status || "N/A")
            .replace("{checkinDate}", bookingClaims[0].checkIn || "N/A")
            .replace("{checkoutDate}", bookingClaims[0].checkOut || "N/A")
            .replace("{fullName}", userClaim.data.data.fullName || "N/A")
            .replace("{userId}", userClaim.data.data.userId || "N/A")
            .replace("{email}", userClaim.data.data.email || "N/A")
            .replace("{phoneNumber}", userClaim.data.data.phone || "N/A")
            .replace("{shareNumber}", bookingClaims[0].shareNumber || "N/A");
        } else {
          travelerDetailsClaim = travelerDetailsClaim
            .replace("{BookingName}", "N/A")
            .replace("{statusBooking}", "N/A")
            .replace("{checkinDate}", "N/A")
            .replace("{checkoutDate}", "N/A")
            .replace("{fullName}", userClaim.data.data.fullName || "N/A")
            .replace("{userId}", userClaim.data.data.userId || "N/A")
            .replace("{email}", userClaim.data.data.email || "N/A")
            .replace("{phoneNumber}", userClaim.data.data.phone || "N/A")
            .replace("{shareNumber}", "N/A");
        }

        requestNumberClaim = requestNumberClaim.replace("{request_id}", newRequestClaim.uniqueNumber);
        return `This is a claim, here are the necessary data to handle it: ${travelerDetailsClaim}. ${requestNumberClaim}`;
      }

      let contextString = "";
      const bookings = await requestGetBookingByUser(await AsyncStorage.getItem("userId"));
      const newRequest = await createFirstRequest(
        await AsyncStorage.getItem("userId"),
        clickedProduct.product?.id || "a531dd1d-6b90-4fd1-a2e5-0e9e795288e3"
      );

      let requestNumber = `The opened request id is ${newRequest.uniqueNumber}`;

      for (const bk of bookings) {
        if (bk.status === 'Active') {
          const house = await requestGetHousesByBooking(bk.houseId);
          const user = await requestGetUser(await AsyncStorage.getItem("userId"));

          let houseDetails = `House Details: House Name: ${house.houseName}, Is condo house: ${house.isCondoHouse}, Location: ${house.number} ${house.address}, ${house.neighbourhood}, ${house.city}, ${house.state}, ${house.zipCode}, ${house.country}, Maximum Capacity: ${house.maximumCapacity}, Pets Allowed: ${house.petsAllowed}, Smoking Allowed: ${house.smokingAllowed}, Parties Allowed: ${house.partiesAllowed}`;

          let amenities = `Amenities: Has Pool: ${house.hasPool}, Has Babercue Grill: ${house.hasBabercueGrill}, Has Central Air Conditioner: ${house.hasCentralAirConditioner}, Has Splitter Air Conditioner: ${house.hasSplitterAirConditioner}, Has Dryer: ${house.hasDryer}, Has Washing Machine: ${house.hasWashingMachine}, Has Wi-fi: ${house.hasWifi}`;

          let maxCapacity = `Maximum Guests: ${house.maximumCapacity}, Total Rooms: ${house.totalRooms}, Total Bath Rooms: ${house.totalBathRooms}`;

          let travelerDetails = `Traveler Details: Booking Name: ${bk.bookingName}, Booking Status: ${bk.status}, Check - In Date: ${bk.checkIn}, Check - Out Date: ${bk.checkOut}, Person Name:${user.data.data.fullName}, Person Id:${user.data.data.userId}, Email: ${user.data.data.email}, Phone: ${user.data.data.phone}, Share Number: ${bk.shareNumber}.`;

          let offers = "";
          for (const prd of productData) {
            const address = await getAddressById(prd.product?.location);
            offers += `The following is an offer: The product name ${prd.product?.name || "Nome não disponível"}. ${prd.product?.description || "Descrição não disponível"}. the severity is ${prd.product?.severity || "Severidade não disponível"}. The Address is ${address.number} ${address.address}, ${address.neighbourhood}, ${address.city}, ${address.state}, ${address.country}, ${address.zipCode}.\n\n`;
          }

          return `${houseDetails}. ${amenities}. ${maxCapacity}. ${travelerDetails}. ${offers}. ${requestNumber}`;
        }
      }
    } catch (error) {
      console.log("Error building context: ", error);
      return "";
    }
  };

  useEffect(() => {
    const initializeAmiko = async () => {
      const context = await buildContext();
      const preMessage = await AsyncStorage.getItem("preMessage");
      setClientMessage(preMessage ? String(preMessage) : '');

      const amiko = new Amiko("10000232", context);

      amiko.onChatStateReceived = (newChatState) => {
        setChatState(newChatState);
      };

      amiko.onMessageReceived = async (ServerMessageDto) => {
        setChatState("");
        console.log("Mensagem recebida: ", ServerMessageDto);
        // if (ServerMessageDto.direction === 'outgoing') {
        //   console.log("ENTREI NO IF")
        //   return prevMessages;
        // }

        setMessages(prevMessages => {
          if (prevMessages.some(msg => msg.id === ServerMessageDto.id)) {
            return prevMessages;
          }

          let messageContent = ''

          if (ServerMessageDto.direction && ServerMessageDto.direction == 'outgoing') {
            messageContent = ServerMessageDto.metadata.originalMessage;
          } else {
            messageContent = ServerMessageDto.content;
          }

          return [
            ...prevMessages,
            {
              id: ServerMessageDto.id,
              type: ServerMessageDto.metadata?.agent ? 'agent' :
                ServerMessageDto.direction === 'incoming' ? 'reply' : 'user',
              content: messageContent,
              direction: ServerMessageDto.direction,
              metadata: ServerMessageDto.metadata,
              createdAt: ServerMessageDto.createdAt
            }
          ];
        });
      };

      amiko.onInitMessageList = (initialMessages) => {
        const formattedMessages = initialMessages.map((msg) => ({
          id: msg.id,
          type: msg.metadata?.agent ? 'agent' :
            msg.direction === 'incoming' ? 'reply' : 'user',
          content: msg.direction === 'outgoing' ? msg.metadata.originalMessage : msg.content,
          direction: msg.direction,
          metadata: msg.metadata,
          createdAt: msg.createdAt
        }));
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
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessageToAmiko = async (message) => {
    const messageText = message ? String(message).trim() : '';
    if (!messageText) return;

    const tempId = Date.now().toString();

    // setMessages(prev => [
    //   ...prev,
    //   {
    //     id: tempId,
    //     type: 'user',
    //     content: messageText,
    //     direction: 'outgoing',
    //     metadata: {},
    //     createdAt: new Date().toISOString(),
    //     status: 'sending'
    //   }
    // ]);

    const content = {
      content: messageText,
      toLang: "EN-US",
      fromLang: "PT-BR"
    };

    try {
      await amikoInstance?.sendMessage(content, (response) => {
        setMessages(prev => prev.map(msg =>
          msg.id === tempId ? { ...msg, status: 'sent' } : msg
        ));
      });
      setClientMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? { ...msg, status: 'failed' } : msg
      ));
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
            <Text style={styles.userName}>Amiko</Text>
            <Text style={styles.userStatus}>Online</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => {
            let bubbleStyle, textStyle;

            if (msg.metadata?.agent) {
              bubbleStyle = styles.chatBubbleAgent;
              textStyle = styles.agentMessage;
            } else if (msg.direction === 'outgoing') {
              bubbleStyle = styles.chatBubbleUser;
              textStyle = styles.userMessage;
            } else {
              bubbleStyle = styles.chatBubbleReply;
              textStyle = styles.replyMessage;
            }

            return (
              <View key={`${msg.id}-${index}`} style={bubbleStyle}>
                {msg.metadata?.agent && (
                  <Text style={styles.agentName}>{msg.metadata.agent.name}</Text>
                )}
                <Text style={textStyle}>{msg.content}</Text>
                {msg.status === 'sending' && (
                  <Text style={styles.messageStatus}>Enviando...</Text>
                )}
                {msg.status === 'failed' && (
                  <Text style={[styles.messageStatus, { color: 'red' }]}>Falha ao enviar</Text>
                )}
              </View>
            );
          })}
          {chatState.state === 'composing' && (
            <Text style={styles.typingIndicator}>Amiko está digitando...</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.textAndSendButtonView}>
            <TextInput
              style={styles.textInput}
              placeholder="Digite uma mensagem"
              mode="outlined"
              outlineColor="transparent"
              outlineStyle={{ borderRadius: 24 }}
              value={clientMessage}
              onChangeText={text => setClientMessage(text || '')}
              onSubmitEditing={() => sendMessageToAmiko(clientMessage)}
            />
            <Button
              mode="contained"
              onPress={() => sendMessageToAmiko(clientMessage)}
              style={styles.sendButton}
              disabled={!clientMessage || !clientMessage.trim()}
            >
              <Icon name="send" size={24} color="#364764" />
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

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
    marginLeft: 42,
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
  chatBubbleAgent: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1F5FE',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
  },
  agentMessage: {
    color: '#000',
  },
  agentName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#01579B',
  },
  typingIndicator: {
    marginVertical: 5,
    fontStyle: 'italic',
    color: '#555',
  },
  messageStatus: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
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
    height: Platform.OS === 'ios' ? '100%' : '30%',
    width: Platform.OS === 'ios' ? 342 : 460,
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
});

export default ChatScreen;