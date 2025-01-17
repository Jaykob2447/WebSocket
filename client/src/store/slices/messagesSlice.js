import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../api";

const MESSAGES_SLICE_NAME = "messages";

export const getMessagesThunk = createAsyncThunk(
  `${MESSAGES_SLICE_NAME}/get`,
  async (payload, thunkAPI) => {
    try {
      const response = await http.getMessages(payload);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);

const initialState = {
  messages: [],
  isFetching: false,
  error: null,
  limit: 100,
};

const messagesSlice = createSlice({
  name: MESSAGES_SLICE_NAME,
  initialState,
  reducers: {
    newMessagePending(state) {
      state.isFetching = true;
      state.error = null;
    },
    newMessageSuccess(state, { payload }) {
      state.isFetching = false;
      if (state.messages.length >= state.limit) {
        state.messages.splice(0, 1);
      }
      state.messages.push(payload);
      // state.error = null;
    },
    newMessageError(state, { payload }) {
      state.isFetching = false;
      state.error = payload;
    },
    deleteMessage(state, { payload }) {
      try {
        state.messages.pop(payload);
      } catch (err) {
        console.log(err);
      }
    },
  },
  extraReducers: (builder) => {
    // GET
    builder.addCase(getMessagesThunk.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(getMessagesThunk.fulfilled, (state, { payload }) => {
      state.messages = [];
      state.isFetching = false;
      state.messages.push(...payload.reverse());
    });
    builder.addCase(getMessagesThunk.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload;
    });
  },
});

const { reducer, actions } = messagesSlice;
export const {
  newMessagePending,
  newMessageSuccess,
  newMessageError,
  deleteMessage,
} = actions;

export default reducer;
