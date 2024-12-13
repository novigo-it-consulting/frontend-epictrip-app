import { io } from 'socket.io-client';

class Amiko {
    constructor(uniqueRoomId, contextString) {
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

        this.contextString = contextString;
        this.initializeListeners();
        this.sendContext();
    }

    async initializeListeners() {

        await this.socket.on('EVENT_SERVER_SEND_MESSAGE', (ServerMessageDto) => {
            if (typeof this.onMessageReceived === 'function') {
                this.onMessageReceived(ServerMessageDto);
            }
        });

        await this.socket.on('EVENT_SERVER_INIT_MESSAGE_LIST', (messages) => {
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
            this.socket.emit('EVENT_SET_CONTEXT', { context: "House Details: House Name: Sunset Villa, Type: Single House, Location: 123 Beach Ave, Unit 5, Seaside, Miami, FL, 33101, USA, Coordinates: Latitude 25.7617, Longitude -80.1918, Managed by: Vacation Rentals Inc., Amenities: Pool, BBQ Grill, Garage with Automatic Doors, WiFi, Air Conditioning, Heating, Washing Machine, Dryer, Dishwasher, Cable TV, Smart TV, Shower Type: Walk-in, Maximum Guests: 8, Minimum Age: 21, Smoking Allowed: No, Parties Allowed: No, Pets Allowed: No. Traveler Details: Booking Name: Summer Vacation, Booking Status: Confirmed, Check - In Date: 2024-06 - 15T15:00:00, Check - Out Date: 2024-06 - 22T11:00:00, Traveler Name: Alice Johnson, Email: alice.johnson@example.com, Phone: +1 - 555-0123, Share Number: AB123." });
        }, 1700);
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
