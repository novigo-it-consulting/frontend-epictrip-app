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
import { requestGetBookingByUser, requestGetHousesByBooking, requestGetUser, getAddressById, createFirstRequest } from "../services/api";
import { useRoute } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatScreen = () => {
  const route = useRoute();
  const { productData } = route.params || {};
  const { clickedProduct } = route.params || {};

  const [clientMessage, setClientMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [amikoInstance, setAmikoInstance] = useState(null);
  const [chatState, setChatState] = useState('');
  const scrollViewRef = useRef();
  const { t, i18n } = useTranslation(); // Hook de tradução

  const buildContext = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const notAvailable = t('chatScreen.context.notAvailable');

      if (clickedProduct === 'a531dd1d-6b90-4fd1-a2e5-0e9e795288e3') {
        const newRequestClaim = await createFirstRequest(userId, clickedProduct.product?.id || "a531dd1d-6b90-4fd1-a2e5-0e9e795288e3");
        const userClaim = await requestGetUser(userId);
        const bookingClaims = await requestGetBookingByUser(userId);

        const travelerDetailsData = {
          bookingName: bookingClaims?.[0]?.bookingName || notAvailable,
          statusBooking: bookingClaims?.[0]?.status || notAvailable,
          checkinDate: bookingClaims?.[0]?.checkIn || notAvailable,
          checkoutDate: bookingClaims?.[0]?.checkOut || notAvailable,
          fullName: userClaim?.data?.data?.fullName || notAvailable,
          userId: userClaim?.data?.data?.userId || notAvailable,
          email: userClaim?.data?.data?.email || notAvailable,
          phoneNumber: userClaim?.data?.data?.phone || notAvailable,
          shareNumber: bookingClaims?.[0]?.shareNumber || notAvailable,
        };

        const travelerDetailsClaim = t('chatScreen.context.travelerDetails', travelerDetailsData);
        const requestNumberClaim = t('chatScreen.context.requestNumber', { requestId: newRequestClaim.uniqueNumber });

        return t('chatScreen.context.claimContext', { travelerDetailsClaim, requestNumberClaim });
      }

      const bookings = await requestGetBookingByUser(userId);
      const newRequest = await createFirstRequest(userId, clickedProduct.product?.id || "a531dd1d-6b90-4fd1-a2e5-0e9e795288e3");
      const requestNumber = t('chatScreen.context.requestNumber', { requestId: newRequest.uniqueNumber });

      for (const bk of bookings) {
        if (bk.status === 'Active') {
          const house = await requestGetHousesByBooking(bk.houseId);
          const user = await requestGetUser(userId);

          const houseDetails = t('chatScreen.context.houseDetails', { ...house, interpolation: { escapeValue: false } });
          const amenities = t('chatScreen.context.amenities', { ...house, interpolation: { escapeValue: false } });
          const maxCapacity = t('chatScreen.context.maxCapacity', { ...house, interpolation: { escapeValue: false } });
          const travelerDetails = t('chatScreen.context.travelerDetails', {
            bookingName: bk.bookingName,
            statusBooking: bk.status,
            checkinDate: bk.checkIn,
            checkoutDate: bk.checkOut,
            fullName: user.data.data.fullName,
            userId: user.data.data.userId,
            email: user.data.data.email,
            phoneNumber: user.data.data.phone,
            shareNumber: bk.shareNumber,
          });

          let offers = "";
          for (const prd of productData) {
            const address = await getAddressById(prd.product?.location);
            offers += t('chatScreen.context.offer', {
              productName: prd.product?.name || notAvailable,
              productDescription: prd.product?.description || notAvailable,
              productSeverity: prd.product?.severity || notAvailable,
              ...address
            });
          }

          return `${houseDetails}. ${amenities}. ${maxCapacity}. ${travelerDetails}. ${offers}. ${requestNumber}`;
        }
      }
    } catch (error) {
      console.log("Error building context: ", error);
      return "";
    }
  };

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
      const rand = Math.random() * 16 | 0;
      const value = char === 'x' ? rand : (rand & 0x3 | 0x8);
      return value.toString(16);
    });
  }

  useEffect(() => {
    const initializeAmiko = async () => {
      const context = await buildContext();
      const preMessage = await AsyncStorage.getItem("preMessage");
      setClientMessage(preMessage ? String(preMessage) : '');

      const amiko = new Amiko(generateUUID(), context);

      amiko.onChatStateReceived = (newChatState) => setChatState(newChatState);

      amiko.onMessageReceived = async (ServerMessageDto) => {
        setChatState("");
        setMessages(prevMessages => {
          if (prevMessages.some(msg => msg.id === ServerMessageDto.id)) {
            return prevMessages;
          }
          const messageContent = ServerMessageDto.direction === 'outgoing'
            ? ServerMessageDto.metadata.originalMessage
            : ServerMessageDto.content;

          return [...prevMessages, {
            id: ServerMessageDto.id,
            type: ServerMessageDto.metadata?.agent ? 'agent' : ServerMessageDto.direction === 'incoming' ? 'reply' : 'user',
            content: messageContent,
            direction: ServerMessageDto.direction,
            metadata: ServerMessageDto.metadata,
            createdAt: ServerMessageDto.createdAt
          }];
        });
      };

      amiko.onInitMessageList = (initialMessages) => {
        const formattedMessages = initialMessages.map((msg) => ({
          id: msg.id,
          type: msg.metadata?.agent ? 'agent' : msg.direction === 'incoming' ? 'reply' : 'user',
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
  }, [t]); // Adicionado 't' como dependência

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessageToAmiko = async (message) => {
    const messageText = message ? String(message).trim() : '';
    if (!messageText) return;

    const tempId = Date.now().toString();
    const fromLang = i18n.language.toUpperCase(); // Dinamiza o idioma de origem

    const content = {
      content: messageText,
      toLang: "EN-US",
      fromLang: fromLang
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
              style={{ marginRight: 10 }}
              source={{ uri: 'https://epictrip-dev.s3.us-east-1.amazonaws.com/profilepics/Imagem+do+WhatsApp+de+2024-11-05+%C3%A0(s)+11.31.07_f195be8e.jpg' }}
            />
            <View style={styles.nameStatusContainer}>
              <Text style={styles.userName}>{t('chatScreen.header.userName')}</Text>
              <Text style={styles.userStatus}>{t('chatScreen.header.userStatus')}</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <MaterialCommunityIcons name="phone" size={24} color="#364764" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 16 }}>
              <MaterialCommunityIcons name="dots-vertical" size={24} color="#364764" />
            </TouchableOpacity>
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
                  <Text style={styles.messageStatus}>{t('chatScreen.messages.sending')}</Text>
                )}
                {msg.status === 'failed' && (
                  <Text style={[styles.messageStatus, { color: 'red' }]}>{t('chatScreen.messages.sendFailed')}</Text>
                )}
              </View>
            );
          })}
          {chatState.state === 'composing' && (
            <Text style={styles.typingIndicator}>{t('chatScreen.messages.typing')}</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.textAndSendButtonView}>
            <TouchableOpacity style={styles.attachmentIcon}>
              <MaterialCommunityIcons name="paperclip" size={24} color="#364764" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder={t('chatScreen.input.placeholder')}
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
    backgroundColor: '#e1eaf3ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 50,
  },
  nameStatusContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 12,
    color: 'green',
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
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F6F8FA',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Para Android
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
    paddingHorizontal: 8, // Adicionado para espaçamento interno
  },
  attachmentIcon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
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