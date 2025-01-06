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
  messType,
} from "./types/messages.repository.types";
import configs from "@/src/config";
import axios from "axios";
import { deCodeText } from "@/src/utils/crypto";

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

      //save to DB
      await Promise.all([conversation.save(), newMessage.save()]); //run in same time

      return newMessage as unknown as createdMessage;
    } catch (error) {
      console.error("sendMessage() message.service error:::", error);
      throw error;
    }
  }
  async getMessage(
    userToChatId: string,
    senderId: string,
    query: query,
    senderRole: "User" | "Company",
    receiverRole: "User" | "Company"
  ): Promise<null | conversationRespond> {
    const { limit = 12, page = 1 } = query;

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
        options: {
          limit,
          skip,
          sort: { createdAt: -1 },
        },
      });

      if (!conversation) {
        const endpoint =
          senderRole === "User"
            ? `${configs.corporatorApiEndpoint}/getMulti/Profile?companiesId=`
            : `${configs.userUrl}/`;
        const data = (await axios.get(`${endpoint}${userToChatId}`)).data;

        const receiverData = data.companiesProfile || data.usersProfile;
        console.log("2::::");

        if (!receiverData) {
          return {
            conversation: [],
            currentPage: page,
            totalMessages: 0,
            totalPage: 1,
            limit: limit,
            skip: skip,
          };
        }
        console.log("3::::");
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

        console.log("4::::");
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

      conversation.messages = (conversation.messages as unknown as messType[])
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((message) => {
          message.message = deCodeText(message.message);
          return message;
        }) as unknown as typeof conversation.messages;

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
      if (senderRole === "User") {
        fetchQuery =
          participantsId.length === 0 ? "" : `?companiesId=${participantsId}`;
        api_endpoint = `${configs.corporatorApiEndpoint}/getMulti/Profile`;
      } else if (senderRole === "Company") {
        fetchQuery =
          participantsId.length === 0 ? "" : `?usersId=${participantsId}`;
        api_endpoint = `${configs.userUrl}/getMulti/Profile`;
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
