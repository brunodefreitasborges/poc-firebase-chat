import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase-config';

interface User {
    displayName: string;
    name: string;
  }

// Define message and state types
interface Message {
  text: string;
  timestamp: string | null;
  user: string;
  room: string;
  id: string;
  userName?: string;
}

interface MessagesState {
  messages: Message[];
  loading: boolean;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
};

// Add message to Firebase
export const addMessage = createAsyncThunk(
  'messages/addMessage',
  async ({ text, uid, room }: { text: string; uid: string; room: string }) => {
    const messagesRef = collection(db, 'chat_messages');
    await addDoc(messagesRef, {
      text,
      timestamp: serverTimestamp(),
      user: uid,
      room,
    });
  }
);

// Subscribe to messages in real-time
export const subscribeToMessages = createAsyncThunk(
  'messages/subscribeToMessages',
  async (room: string, { dispatch }) => {
    const messagesRef = collection(db, 'chat_messages');
    const usersRef = collection(db, 'users');
    const q = query(messagesRef, where('room', '==', room), orderBy('timestamp'));

    onSnapshot(q, async (snapshot) => {
      const messagesWithUserDetails: Message[] = [];

      // Use Map for efficient user fetching
      const userIds = new Set<string>();
      snapshot.forEach((doc) => {
        const messageData = doc.data();
        userIds.add(messageData.user);
      });

      // Fetch all users at once
      const userQuery = query(usersRef, where('uid', 'in', Array.from(userIds)));
      const userSnapshot = await getDocs(userQuery);

      const usersMap: { [key: string]: User } = {};
      userSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        usersMap[userData.uid] = {
          displayName: userData.displayName || 'Unknown',
          name: userData.name || 'Unknown',
        };
      });

      snapshot.forEach((doc) => {
        const messageData = doc.data();
        const messageId = doc.id;
        const userData = usersMap[messageData.user];

        messagesWithUserDetails.push({
          text: messageData.text,
          timestamp: messageData.timestamp?.toDate()?.toISOString() || null,
          user: userData?.displayName || 'Unknown',
          room: messageData.room,
          id: messageId,
          userName: userData?.name || 'Unknown',
        });
      });

      // Dispatch an action to update the Redux store
      dispatch(messagesSlice.actions.setMessages(messagesWithUserDetails));
    });
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addMessage.rejected, (state) => {
        state.loading = false;
      })
      .addCase(subscribeToMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(subscribeToMessages.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeToMessages.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
