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

const ChatScreen = () => {
  const [clientMessage, setClientMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [amikoInstance, setAmikoInstance] = useState(null);
  const [chatState, setChatState] = useState('');
  const scrollViewRef = useRef();

  const gerarInteiroAleatorio = () => {
    return Math.floor(Math.random() * 1000) + 1;
  }

  useEffect(() => {
    const contextAmiko = { context: "House Details: House Name: Sunset Villa, Type: Single House, Location: 123 Beach Ave, Unit 5, Seaside, Miami, FL, 33101, USA, Coordinates: Latitude 25.7617, Longitude -80.1918, Managed by: Vacation Rentals Inc., Amenities: Pool, BBQ Grill, Garage with Automatic Doors, WiFi, Air Conditioning, Heating, Washing Machine, Dryer, Dishwasher, Cable TV, Smart TV, Shower Type: Walk-in, Maximum Guests: 8, Minimum Age: 21, Smoking Allowed: No, Parties Allowed: No, Pets Allowed: No. Traveler Details: Booking Name: Summer Vacation, Booking Status: Confirmed, Check - In Date: 2024-06 - 15T15:00:00, Check - Out Date: 2024-06 - 22T11:00:00, Traveler Name: Alice Johnson, Email: alice.johnson@example.com, Phone: +1 - 555-0123, Share Number: AB123." };
    const initializeAmiko = async () => {
      setClientMessage(await AsyncStorage.getItem("preMessage"));
      const amiko = new Amiko(`${gerarInteiroAleatorio()}`, contextAmiko);

      amiko.onChatStateReceived = (newChatState) => {
        console.log("--------------------------------------------------")
        console.log("Novo estado do chat recebido:", newChatState);
        console.log("--------------------------------------------------")
        setChatState(newChatState);
      };

      amiko.onMessageReceived = (ServerMessageDto) => {
        console.log("--------------------------------------------------")
        console.log("Mensagem recebida do servidor:", ServerMessageDto);
        console.log("--------------------------------------------------")
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
