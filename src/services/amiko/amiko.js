import { io } from 'socket.io-client';

class Amiko {
    constructor(uniqueRoomId, contextString) {
        this.chatId = '478ae18a-596c-4ee8-b6a7-6422cf2571ca';
        this.token = '99jWB13psRBWs5CwcbssGG';

        this.socket = io(`ws://web-socket.fertech.dev.br`, {
            auth: {
                instance: {
                    chatId: this.chatId,
                    token: this.token,
                },
                roomId: uniqueRoomId,
            },
        });

        this.contextString = contextString;
        this.initializeListeners();
        this.sendContext(contextString);
    }

    async initializeListeners() {

        await this.socket.on('EVENT_SERVER_SEND_MESSAGE', (ServerMessageDto) => {
            if (typeof this.onMessageReceived === 'function') {
                this.onMessageReceived(ServerMessageDto);
            }
        });

        await this.socket.on('EVENT_SERVER_INIT_MESSAGE_LIST', (messages) => {
            console.log("mensagenssss: ", messages)
            if (typeof this.onInitMessageList === 'function') {
                this.onInitMessageList(messages);
            }
        });

        await this.socket.on('EVENT_SERVER_SEND_CHAT_STATE', (chatState) => {
            if (typeof this.onChatStateReceived === 'function') {
                this.onChatStateReceived(chatState);
            }
        });

        await this.socket.on('EVENT_SERVER_SEND_MESSAGE_STATUS', (status) => {
            if (typeof this.onMessageStatusUpdated === 'function') {
                this.onMessageStatusUpdated(status);
            }
        });

        await this.socket.on('EVENT_SERVER_SEND_USER_DATA', (userData) => {
            if (typeof this.onUserDataReceived === 'function') {
                this.onUserDataReceived(userData);
            }
        });

        await this.socket.on('EVENT_INIT_ROOM', (roomId) => {
            if (typeof this.onRoomInit === 'function') {
                this.onRoomInit(roomId);
            }
        });

        await this.socket.on('EVENT_ERROR', (error) => {
            if (typeof this.onError === 'function') {
                this.onError(error);
            }
        });

    }

    sendContext(context) {
        setTimeout(() => {
            this.socket.emit('EVENT_SET_CONTEXT', { context: context });
        }, 1700);
    }

    sendMessage(content, callback) {
        console.log("AQUIIIII", content)
        this.socket.emit('EVENT_CLIENT_SEND_MESSAGE', content, (response) => {
            if (callback) {
                callback(response);
            }
        });
    }

}

export default Amiko;