import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model";
import MessageModel from "../models/message.model";
import {
  conversation,
  GetConversation,
  conversationRespond,
  createdMessage,
  query,
  RespondGetConversations,
  RespondGetConversationsPagination,
} from "./types/messages.repository.types";

export class MessageRepository {
  async sendMessage(makeMessage: {
    senderId: string;
    receiverId: string;
    message: string;
    participants: {
      participantType: string;
      participantId: string;
    }[];
    roomId: string;
  }): Promise<createdMessage> {
    try {
      const { senderId, receiverId, message, participants, roomId } =
        makeMessage;
      //find or create
      let conversation = await ConversationModel.findOneAndUpdate(
        { roomId },
        { $setOnInsert: { participants, roomId } },
        { new: true, upsert: true }
      );

      const newMessage = await new MessageModel({
        senderId,
        receiverId,
        message,
        conversationId: conversation._id,
      });

      if (newMessage) {
        conversation.messages.push(
          newMessage._id as unknown as mongoose.Schema.Types.ObjectId
        );
      }
      //todo: socket

      //save to DB
      await Promise.all([conversation.save(), newMessage.save()]); //run in same time

      return newMessage as unknown as createdMessage;
    } catch (error) {
      console.error("sendMessage() message.service error:::", error);
      throw error;
    }
  }
  //todo: reduce / structure type
  async getMessage(
    userToChatId: string,
    senderId: string,
    query: query,
    senderRole: "User" | "Company",
    receiverRole: "User" | "Company"
  ): Promise<null | conversationRespond> {
    //conversation
    const { limit = 7, page = 1 } = query;

    const skip = (page - 1) * limit;

    try {
      const conversation = await ConversationModel.findOne({
        participants: {
          $all: [
            { $elemMatch: { participantId: senderId } },
            { $elemMatch: { participantId: userToChatId } },
          ],
        },
      }).populate({
        path: "messages",
        options: { limit, skip, sort: { createdAt: 1 } },
        // model: MessageModel,
        // select: "_id senderId receiverId message createdAt updatedAt",
      });
      if (!conversation) {
        const roomId = [senderId, userToChatId].sort().join("_");
        const participants = [
          {
            participantType: senderRole,
            participantId: senderId,
          },
          {
            participantType: receiverRole,
            participantId: userToChatId,
          },
        ].sort();

        const conversation = await ConversationModel.findOneAndUpdate(
          { roomId },
          { $setOnInsert: { participants, roomId } },
          { new: true, upsert: true }
        );

        await Promise.all([conversation.save()]); //save new conversation to DB
        return {
          conversation: conversation as unknown as conversation,
          currentPage: page,
          totalMessages: 0,
          totalPage: 1,
          limit: limit,
          skip: skip,
        };
      }

      // Step 2: Count total messages for the conversation separately
      const totalMessages = await MessageModel.countDocuments({
        conversationId: conversation._id,
      });

      const totalPage = Math.ceil(totalMessages / limit);

      return {
        conversation: conversation as unknown as conversation,
        currentPage: page,
        totalMessages,
        totalPage,
        limit,
        skip,
      };
    } catch (error) {
      console.error("getMessage() message.service error:::", error);
      throw error;
    }
  }
  async getConversationById(conversationId: string): Promise<conversation> {
    try {
      const conversation = await ConversationModel.findById(conversationId);

      return conversation as unknown as conversation;
    } catch (error) {
      throw error;
    }
  }
  async getUserConversations(
    senderId: string,
    senderRole: string,
    page: number,
    limit: number,
    skip: number
  ): Promise<RespondGetConversationsPagination> {
    try {
      //find conversation
      const conversation = await ConversationModel.find({
        participants: {
          $all: [
            {
              $elemMatch: {
                participantType: senderRole,
                participantId: senderId,
              },
            },
          ],
        },
      })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip);
      //count conversation
      const totalConversations = await ConversationModel.countDocuments({
        participants: {
          $all: [
            {
              $elemMatch: {
                participantType: senderRole,
                participantId: senderId,
              },
            },
          ],
        },
      });
      //filter conversations
      const returnConversations = (
        conversation as unknown as GetConversation[]
      ).map((con: GetConversation) => {
        const participant = con.participants.filter(
          (part) =>
            part.participantType !== senderRole &&
            part.participantId !== senderId
        )[0];

        const conversation = {
          _id: con._id,
          receiver: participant.participantId,
          messages: con.messages,
          updatedAt: con.updatedAt,
          role: participant.participantType,
          profile: "",
          name: "",
        };
        return conversation;
      });
      //convert participantId to  string
      const participantsId =
        returnConversations.length === 0
          ? ""
          : returnConversations.map((con) => con.receiver).join(",");
      //declare endpoint and query to get participant Profile Detail from endpoint
      let fetchQuery: string = "";
      let api_endpoint: string = "";
      //todo: user/company fetch data
      if (senderRole === "User") {
        fetchQuery =
          participantsId.length === 0 ? "" : `?companiesId=${participantsId}`;
        api_endpoint = "http://localhost:4003/v1/companies/getMulti/Profile";
      } else if (senderRole === "Company") {
        //TODO: fetch to user to get profile
        fetchQuery = `?users=${participantsId}`;
        api_endpoint = "http://localhost:4005/v1/users/getMulti/Profile";
      }

      const res = await fetch(`${api_endpoint}${fetchQuery}`);

      const data = await res.json();
      //declare
      let participantsProfile:
        | {
            _id: string;
            profile: string;
            name: string;
          }[]
        | [];
      if (data.companiesProfile) {
        participantsProfile = data.companiesProfile;
      } else if (data.usersProfile) {
        participantsProfile = data.usersProfile;
      }
      //check compare the participant from db and fetching must be match to ensure correctly
      if (participantsProfile! && participantsProfile.length !== 0) {
        for (let i = 0; i < participantsProfile!.length; i++) {
          const participantId = new mongoose.Types.ObjectId(
            participantsProfile![i]._id
          );
          for (let j = 0; j < returnConversations.length; j++) {
            if (
              participantId.toString() ===
              returnConversations[j].receiver.toString()
            ) {
              returnConversations[j].profile = participantsProfile![i].profile;
              returnConversations[j].name = participantsProfile![i].name;
              break;
            }
          }
        }
      }
      //
      const totalPage = Math.ceil(totalConversations / limit);
      const paginationConversations: RespondGetConversationsPagination = {
        conversations:
          returnConversations as unknown as RespondGetConversations,
        currentPage: page,
        limit: limit,
        skip: skip,
        totalConversation: totalConversations,
        totalPage: totalPage,
      };
      //
      return paginationConversations as unknown as RespondGetConversationsPagination;
    } catch (error) {
      throw error;
    }
  }
}
