import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import firebase from 'firebase';
import { resolveTypeReferenceDirective } from "typescript";

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
    async (data, thunkAPI) => {
        // console.log('fetchLogin','data: ', data, 'thunkAPI: ', thunkAPI);
        
        // let fetchAfterLogin;
        // await axios.post('/login', data)
        //     .then(res => {
        //         setAuthorizationHeader(res.data.token);
        //     })
        //     .catch(err => {
        //         console.log('login post error: ', err);
        //         return err;
        //     });
        // await axios.get('/user')
        //     .then(res => {
        //         console.log(res.data);
        //         fetchAfterLogin = res.data;
        //     })
        //     .catch(err => {
        //         console.log('getUserData error', err);
        //         return err;
        //     });
        // return fetchAfterLogin;

        // ----------------------------------------------
        // エラーだったらサーバーが返してくれるかの確認
        // let fetchAfterLogin;
        let token;
        let error;
        await axios.post('/login', data)
            .then(res => {
                // tokenが返ってくる
                // console.log('post /login res.data.token: ', res.data.token);
                token = res.data.token;
                // return res.data.token;
            })
            .catch(err => {
                console.log('login post error: ', err.response.data);
                error = err.response.data;
                // return err.response.data;
            });
        if (token) {
            return token;
        } else {
            return error;
        }

        // -----------------------------------------------

        // error try catch
        // let fetchAfterLogin;
        // try {
        //     let res = await axios.post('/login', data)
        //     console.log('token', res.data.token)
        //     setAuthorizationHeader(res.data.token);
        // } catch (err) {
        //     thunkAPI.rejectWithValue({ errMessage: 'Fetch error' })
        //     return 
        // }
        // try {
        //     let res = await axios.get('/user');
        //     fetchAfterLogin = res.data;
        //     console.log('fetchAfterLogin after get req: ', fetchAfterLogin)
        // } catch (err) {
        //     thunkAPI.rejectWithValue({ errMessage: 'Get Error'})
        //     return 
        // }
        // return fetchAfterLogin
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

// updateImage
export const updateImageAsync = createAsyncThunk(
    'users/updateImageAsync',
    async (data) => {
        console.log('file', data.file);
        console.log('file name', data.file.name);
        console.log('handle', data.handle);
        const storageRef = firebase.storage().ref(data.file.name);
        console.log(storageRef);

        // firebase.storage().ref(file.name).put(file)
        await storageRef.put(data.file)
            .then(res => {
                console.log('upload image successfully', res);
                
            });
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
        },
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
            // .addCase(fetchLoginUserAsync.fulfilled, (state, action) => {
            //     console.log('fetchLoginUserAsync fulfilled: ', action.payload);
            //     alert('Welcome !')
            //     state.loginUser.isLoggedIn = true;
            //     state.loginUser = action.payload;
            //     state.isLoading = false;
            // })
            .addCase(fetchLoginUserAsync.fulfilled, (state, action) => {
                console.log('fetchLoginUserAsync fulfilled: ', action.payload);
                if (action.payload.general) {
                    state.error = action.payload.general
                    state.isLoading = false;
                } else {
                    alert('Welcome !')
                    state.loginUser.isLoggedIn = true;
                    localStorage.setItem('FBIdToken', `Bearer ${action.payload}`);
                    // console.log('localStorage', localStorage);
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
            .addCase(changeUserDetailsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changeUserDetailsAsync.fulfilled, (state, action) => {
                console.log('changeUserDetailsAsync.fulfilled', action.payload);
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

export const { editUserDetails, changeUserDetails, markNotificationsRead } = userSlice.actions;
export default userSlice.reducer;