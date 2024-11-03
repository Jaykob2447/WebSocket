import axios from 'axios';
import { io } from 'socket.io-client';
import {
  newMessageError,
  newMessageSuccess,
} from '../store/slices/messagesSlice';

const axiosOptions = {
  baseURL: 'http://127.0.0.1:5000/api',
};

const apiInstance = axios.create(axiosOptions);

export const getMessages = limit => apiInstance.get(`/messages?limit=${limit}`);

// -------------------
const socketClient = io('ws://localhost:5000');
// socketClient.emit('connection', socketClient)

export const createMessage = newMessage => {
  socketClient.emit('NEW_MESSAGE', newMessage);
};

export const initSocket = store => {
  socketClient.on('NEW_MESSAGE_SUCCESS', payload => {
    store.dispatch(newMessageSuccess(payload));
  });

  socketClient.on('NEW_MESSAGE_ERROR', payload => {
    store.dispatch(newMessageError(payload));
  });
};
