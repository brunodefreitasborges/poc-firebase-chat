// slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';

// Define the user state type
interface UserState {
  user: { uid: string } | null; // Firebase user
  userDetails: { displayName: string; id: string } | null; // Firestore user details
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  userDetails: null,
  loading: false,
};

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (uid: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return { displayName: data.displayName, id: data.uid };
    }
    return null;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ uid: string } | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
