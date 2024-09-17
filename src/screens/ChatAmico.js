import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';

const ChatScreen = () => {
  return (
    <>
      <SafeAreaView />
      {/* Envolver o conteúdo com KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'} // Usar 'padding' no iOS para elevar a View corretamente
        keyboardVerticalOffset={20} // Ajustar a distância do teclado
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Image
              size={50}
              source={{ uri: 'https://via.placeholder.com/150' }} // Substitua pela URL da imagem correta
            />
            <View>
              <Text style={styles.userName}>Courtney Kim</Text>
              <Text style={styles.userStatus}>Online</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <Button icon="phone" compact onPress={() => {}} />
            <Button icon="video" compact onPress={() => {}} />
          </View>
        </View>

        {/* Body (Chat messages) */}
        <ScrollView style={styles.chatContainer}>
          <View style={styles.chatBubbleSystem}>
            <Text style={styles.systemMessage}>
              A tickets request was open. You can check it on your{' '}
              <Text style={styles.linkText}>Requests</Text>.
            </Text>
          </View>

          <View style={styles.chatBubbleUser}>
            <Text style={styles.userMessage}>
              Hello Courtney! 😊 I need help with the event of Universal Studios
            </Text>
          </View>

          <View style={styles.chatBubbleReply}>
            <Text style={styles.replyMessage}>
              Of course, I will be glad to help 😇 What do you want to know?
            </Text>
          </View>

          <View style={styles.chatBubbleUser}>
            <Text style={styles.userMessage}>Prices and dates</Text>
          </View>
        </ScrollView>

        {/* Footer (Message input) */}
        <View style={styles.footer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message"
            mode="outlined"
            outlineColor="transparent"
            outlineStyle={{ borderRadius: 24 }}
          />
          <Button
            mode="contained"
            icon={"send"}
            onPress={() => {}}
            style={styles.sendButton}
          >
          </Button>
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
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  },
  userStatus: {
    fontSize: 12,
    color: 'green',
    marginLeft: 10
  },
  headerIcons: {
    flexDirection: 'row',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  chatBubbleSystem: {
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
    marginVertical: 5,
  },
  systemMessage: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center"
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E90FF',
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
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
  },
  replyMessage: {
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  textInput: {
    flex: 0.8,
    marginRight: 10,
    borderRadius: 24, 
    backgroundColor: "#E0E0E0",
    borderWidth: 0,
  },
  sendButton: {
    borderRadius: 20,
    height: "100%",
    flex: 0.25,
    justifyContent: "center",
  },
});

export default ChatScreen;
