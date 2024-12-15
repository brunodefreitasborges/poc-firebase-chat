// slices/roomsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase-config';

// Define the room type
interface Room {
  name: string;
  id: string;
}

// Define the state type
interface RoomsState {
  rooms: Room[];
  loading: boolean;
}

const initialState: RoomsState = {
  rooms: [],
  loading: false,
};

// Async thunk to fetch rooms
export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  const roomsRef = collection(db, 'rooms');
  const q = query(roomsRef);

  return new Promise<Room[]>((resolve) => {
    const subscription = onSnapshot(q, (snapshot) => {
      const rooms: Room[] = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        id: doc.id,
      }));
      resolve(rooms);
      subscription(); // Cleanup subscription
    });
  });
});

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
        state.rooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchRooms.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default roomsSlice.reducer;
