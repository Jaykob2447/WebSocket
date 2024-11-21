import { io } from "socket.io-client";
import {
  newMessageError,
  newMessageSuccess,
  deleteMessage as deleteMassageSuccess,
} from "../store/slices/messagesSlice";
import CONSTANTS from "../constants";

const {
  SOCKET_EVENTS: {
    NEW_MESSAGE,
    NEW_MESSAGE_SUCCESS,
    NEW_MESSAGE_ERROR,
    DELETE_MESSAGE,
    DELETE_MESSAGE_SUCCESS,
    DELETE_MESSAGE_ERROR,
  },
} = CONSTANTS;

const socketClient = io("ws://localhost:5000");
// socketClient.emit('connection', socketClient)

export const createMessage = (newMessage) => {
  socketClient.emit(NEW_MESSAGE, newMessage);
};

export const deleteMessage = (deleteMessage) => {
  socketClient.emit(DELETE_MESSAGE, deleteMessage);
};

export const initSocket = (store) => {
  socketClient.on(NEW_MESSAGE_SUCCESS, (payload) => {
    store.dispatch(newMessageSuccess(payload));
  });

  socketClient.on(NEW_MESSAGE_ERROR, (payload) => {
    store.dispatch(newMessageError(payload));
  });

  socketClient.on(DELETE_MESSAGE_ERROR, (payload) => {
    store.dispatch(newMessageError(payload));
  });

  socketClient.on(DELETE_MESSAGE_SUCCESS, (payload) => {
    store.dispatch(deleteMassageSuccess(payload));
  });
};
