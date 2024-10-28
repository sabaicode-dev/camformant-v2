import { IMessage } from "@/src/database/models/message.model";
import { MessageRepository } from "@/src/database/repositories/message.repository";
import { enCodeText } from "../utils/crypto";

export class MessageService {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  async saveMessage({
    text,
    senderId,
    recipientId,
    conversationId,
  }: {
    text: string;
    senderId: string;
    recipientId: string;
    conversationId: string;
  }): Promise<IMessage> {
    console.log("xxxxx::::::::", text, senderId, recipientId, conversationId);

    try {
      console.log("sendid", senderId);
      const messageData = {
        text: enCodeText(text),
        senderId,
        recipientId,
        conversationId,
      };
      console.log("message:::::: ", messageData);
      const result = await this.messageRepository.createMessage(messageData);
      return result;
    } catch (error) {
      console.error("MessageService saveMessage() method error::: ", error);
      throw error;
    }
  }

  async getMessagesByConversationId(
    conversationId: string
  ): Promise<IMessage[]> {
    try {
      const result =
        await this.messageRepository.getMessagesByConversationId(
          conversationId
        );
      return result;
    } catch (error) {
      console.error(
        "MessageService getMessagesByConversationId() method error::: ",
        error
      );
      throw error;
    }
  }
}
