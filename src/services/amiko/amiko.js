import { io } from 'socket.io-client';

class Amiko {
    constructor(uniqueRoomId) {
        this.chatId = '478ae18a-596c-4ee8-b6a7-6422cf2571ca';
        this.token = '99jWB13psRBWs5CwcbssGG';

        this.socket = io(`wss://mia-chat-api.vinna.one`, {
            auth: {
                instance: {
                    chatId: this.chatId,
                    token: this.token,
                },
                roomId: uniqueRoomId,
            },
        });

        this.initializeListeners();
    }

    initializeListeners() {
        this.socket.on('EVENT_SERVER_SEND_MESSAGE', (ServerMessageDto) => {
            if (typeof this.onMessageReceived === 'function') {
                this.onMessageReceived(ServerMessageDto);
            }
        });

        this.socket.on('EVENT_SERVER_INIT_MESSAGE_LIST', (messages) => {
            if (typeof this.onInitMessageList === 'function') {
                this.onInitMessageList(messages);
            }
        });

        this.socket.on('EVENT_SERVER_SEND_CHAT_STATE', (chatState) => {
            if (typeof this.onChatStateReceived === 'function') {
                this.onChatStateReceived(chatState);
            }
        });

        this.socket.on('EVENT_SERVER_SEND_MESSAGE_STATUS', (status) => {
            if (typeof this.onMessageStatusUpdated === 'function') {
                this.onMessageStatusUpdated(status);
            }
        });

        this.socket.on('EVENT_SERVER_SEND_USER_DATA', (userData) => {
            if (typeof this.onUserDataReceived === 'function') {
                this.onUserDataReceived(userData);
            }
        });

        this.socket.on('EVENT_INIT_ROOM', (roomId) => {
            if (typeof this.onRoomInit === 'function') {
                this.onRoomInit(roomId);
            }
        });

        this.socket.on('EVENT_ERROR', (error) => {
            if (typeof this.onError === 'function') {
                this.onError(error);
            }
        });
    }

    sendMessage(content, callback) {
        const clientMessage = { content };
        this.socket.emit('EVENT_CLIENT_SEND_MESSAGE', clientMessage, (response) => {
            if (callback) {
                callback(response);
            }
        });
    }
}

export default Amiko;
