import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },

        setError: (state, action)=>{
            state.error = action.payload;
        },

        signUpStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        signUpSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },

        signUpFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateStart: (state) => {
            state.loading = true,
            state.error = null
        },

        updateSuccess: (state, action) => {
            state.currentUser = action.payload,
            state.loading = false,
            state.error = null
        },

        updateFailure: (state, action) => {
            state.loading = false,
            state.error = action.payload
        },

        deleteUserStart: (state) => {
            state.loading = true,
            state.error = null
        },

        deleteUserSuccess: (state) => {
            state.currentUser = null,
            state.loading = false,
            state.error = null
        },

        deleteUserFailure: (state, action) => {
            state.loading = false,
            state.error = action.payload
        },

        signOutStart: (state) => {
            state.loading = true,
            state.error = null
        },

        signOutSuccess: (state) => {
            state.currentUser = null,
            state.loading = false,
            state.error = null
        },

        signOutFailure: (state, action) => {
            state.loading = false,
            state.error = action.payload
        },

    }
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    signUpStart,
    signUpSuccess,
    signUpFailure,
    clearError,
    setError,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure
} = userSlice.actions;

export default userSlice.reducer;