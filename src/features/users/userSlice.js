import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import firebase from 'firebase';

const initialState = {
    loginUser: {
        credentials: {
            bio: "",
            createdAt: "",
            email: "",
            handle: "",
            imageUrl: "",
            location: "",
            userId: "",
        },
        likes: [],
        notifications: [],
    },
    isLoggedIn: false,
    isLoading: false,
    error: '',
}

// header
export const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
};

// Async
// Login
export const fetchLoginUserAsync = createAsyncThunk(
    'screams/fetchLoginUserAsync',
    async (data) => {
        let token;
        let error;
        await axios.post('/login', data)
            .then(res => {
                token = res.data.token;
            })
            .catch(err => {
                error = err.response.data;
            });
        if (token) {
            return token;
        } else {
            return error;
        }
    }
);
// setUser
export const setUserAsync = createAsyncThunk(
    'users/setUserAsync',
    async () => {
        let fetchedUserData;
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;

        await axios.get('/user')
            .then(res => {
                fetchedUserData = res.data;
            })
            .catch(err => {
                console.log(err);
            });
        return fetchedUserData;
    }
);

// Logout
export const logoutAsync = createAsyncThunk(
    'users/logoutAsync',
    async () => {
        localStorage.removeItem('FBIdToken');
        delete axios.defaults.headers.common['Authorization'];
    }
)

// changeUserDetails
export const changeUserDetailsAsync = createAsyncThunk(
    'users/changeUserDetailsAsync',
    async (data) => {
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        await axios.post('/user', data)
        return data
    }
)

// updateImage
export const updateImageAsync = createAsyncThunk(
    'users/updateImageAsync',
    async (data) => {
        const storageRef = firebase.storage().ref(data.file.name);
        await storageRef.put(data.file)
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/socialape-73b9a.appspot.com/o/${data.file.name}?alt=media`;
        
        firebase.firestore()
        .doc(`users/${data.handle}`)
        .update({ imageUrl: imageUrl })
        .catch(err => {
            console.log(err);
        });
        return imageUrl
    }
)

// userSlice
export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        markNotificationsRead: (state, action) => {
            if (action.payload.length > 0) {
                const FBIdToken = localStorage.FBIdToken;
                axios.defaults.headers.common['Authorization'] = FBIdToken;
                axios.post('/notifications', action.payload)
                    .catch(err => console.log(
                    err)
                )
                state.loginUser.notifications.forEach(notification => notification.read = true)
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoginUserAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLoginUserAsync.fulfilled, (state, action) => {
                if (action.payload.general) {
                    state.error = action.payload.general
                    state.isLoading = false;
                } else {
                    alert('Welcome !')
                    state.loginUser.isLoggedIn = true;
                    localStorage.setItem('FBIdToken', `Bearer ${action.payload}`);
                    state.isLoading = false;
                    state.error = '';
                }
            })
            .addCase(fetchLoginUserAsync.rejected, (value) => {
                console.log('fetchLoginUserAsync rejected: ', value)
            })
            .addCase(setUserAsync.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.loginUser = action.payload;
                state.isLoading = false;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.loginUser = {
                    credentials: {
                        bio: "",
                        createdAt: "",
                        email: "",
                        handle: "",
                        imageUrl: "",
                        location: "",
                        userId: "",
                    }
                };
                state.isLoggedIn = false;
            })
            .addCase(changeUserDetailsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changeUserDetailsAsync.fulfilled, (state, action) => {
                state.loginUser.credentials.bio = action.payload.bio;
                state.loginUser.credentials.location = action.payload.location;
                state.isLoading = false;
            })
            .addCase(updateImageAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateImageAsync.fulfilled, (state, action) => {
                state.loginUser.credentials.imageUrl = action.payload;
                state.isLoading = false;
            })
    }
});

export const { markNotificationsRead } = userSlice.actions;
export default userSlice.reducer;