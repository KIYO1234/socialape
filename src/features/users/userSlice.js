import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
    isLoggedIn: false
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
        let fetchAfterLogin;
        await axios.post('/login', data)
            .then(res => {
                setAuthorizationHeader(res.data.token);
            })
            .catch(err => {
                console.log(err);
            });
        await axios.get('/user')
            .then(res => {
                console.log(res.data);
                fetchAfterLogin = res.data;
            })
            .catch(err => {
                console.log(err);
            });
        return fetchAfterLogin;
    }
);
// setUser
export const setUserAsync = createAsyncThunk(
    'users/setUserAsync',
    async () => {
        let fetchedUserData;
        console.log('setUserAsync');
        // リクエストにheaderをつける作業
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;

        await axios.get('/user')
            .then(res => {
                console.log(res.data);
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
        console.log('changeUserDetailsAsync in async', data)
        await axios.post('/user', data)
        return data
    }
)



export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        editUserDetails: (state, action) => {
            console.log('editUserDetails')
            const FBIdToken = localStorage.FBIdToken;
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            axios.get(`/user/${action.payload.handle}`)
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => {
                    console.error(err);
                })
            // history.push('/')
        },
        changeUserDetails: (state, action) => {
            console.log('changeUserDetails', action.payload);

            axios.post('/user', action.payload).then(res => {
                console.log(res.data)
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoginUserAsync.fulfilled, (state, action) => {
                alert('Welcome !')
                state.loginUser.isLoggedIn = true;
                state.loginUser = action.payload;
            })
            .addCase(fetchLoginUserAsync.pending, () => {
                console.log('fetchLoginUserAsync is pending...')
            })
            .addCase(setUserAsync.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.loginUser = action.payload;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                console.log('logoutAsync is fulfilled!');
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
            .addCase(changeUserDetailsAsync.fulfilled, (state, action) => {
                console.log('changeUserDetailsAsync.fulfilled', action.payload);
                state.loginUser.credentials.bio = action.payload.bio;
                state.loginUser.credentials.location = action.payload.location;
            })
    }
});

export const { editUserDetails, changeUserDetails } = userSlice.actions;
export default userSlice.reducer;