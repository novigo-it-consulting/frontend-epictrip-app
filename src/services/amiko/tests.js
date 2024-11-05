import Amiko from "./amiko.js";
import ClientMessageDto from "./clientMessageDto.js";

const chatServices = new Amiko("8");

const clientMessage = new ClientMessageDto();
clientMessage.content = 'Oi, quero um carrinho de bebe';

chatServices.sendMessage(clientMessage.content, (response) => {
    console.log("Resposta do servidor:", response);
});

console.log("Mensagem enviada, aguardando resposta...");
