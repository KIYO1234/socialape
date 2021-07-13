import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    screams: [],
    comments: [],
    allComments: [],
    relatedComments: [],
    likes: [],
    isLoading: false,
}

export const fetchScreamsAsync = createAsyncThunk(
    'screams/fetchScreamsAsync',
    async () => {
        let screams = [];
        await axios.get('/screams')
            .then(res => {
                screams = res.data;
            })
            .catch(err => {
                console.log(err)
                alert('Cannot fetch screams')
            })
        return screams;
    }
);

// add a scream
export const addScream = createAsyncThunk(
    'screams/addScream',
    async (data) => {
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        let newScream;
        await axios.post('/scream', data)
            .then(res => newScream = res.data)
            .catch(err => console.log(err));
        return newScream;
    }
)

// Fetch all likes
export const fetchAllLikes = createAsyncThunk(
    'screams/fetchAllLikes',
    async () => {
        let likes;
        await axios.get('/likes')
            .then(res => {
                likes = res.data;
            })
        return likes;
    }
)

// like a scream
export const likeAsync = createAsyncThunk(
    'screams/likeAsync',
    async (selectedScream) => {        
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        await axios.get(`/scream/${selectedScream.screamId}/like`)
            .catch(err => console.log(err));
        return selectedScream;
    }
)

// unlike a scream
export const unlikeAsync = createAsyncThunk(
    'screams/unlikeAsync',
    async (selectedScream) => {
        await axios.get(`/scream/${selectedScream.screamId}/unlike`)
        .catch(err => console.log(err));
        return selectedScream;
    }
)

// Add a comment
export const commentAsync = createAsyncThunk(
    'screams/commentAsync',
    async (data) => {
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        let response;
        await axios.post(`/scream/${data.scream.screamId}/comment`, {body: data.comment, scream: data.scream, sender: data.sender})
            .then(res => {
                response = res.data;
            })
            .catch(err => {
                console.log(err);
            })
        return response;
    }
)

// Fetch all comments
export const fetchAllCommentsAsync = createAsyncThunk(
    'screams/fetchAllCommentsAsync',
    async () => {
        let comments;
        await axios.get('/comments')
            .then(res => {
                comments = res.data;
            })
            .catch(err => {
                console.log(err);
            });
        return comments;
    }
)

// Fetch related screams
export const fetchRelatedScreams = createAsyncThunk(
    'screams/fetchRelatedScreams',
    async (screamId) => {
        let relatedComments;
        await axios.get(`/comments/${screamId}`)
            .then(res => relatedComments = res.data)
            .catch(err => console.log(err));
        return relatedComments;
    }
)


export const screamSlice = createSlice({
    name: 'screams',
    initialState,
    reducers: {
        deleteScream: (state, action) => {
            const FBIdToken = localStorage.FBIdToken;
            axios.defaults.headers.common['Authorization'] = FBIdToken;
            axios.delete(`/scream/${action.payload}`)
            const filteredScreams = state.screams.filter(scream => scream.screamId !== action.payload);
            state.screams = filteredScreams;
        },
        addRelatedComment: (state, action) => {
            state.relatedComments = [action.payload, ...state.relatedComments];
            state.allComments = [action.payload, ...state.allComments];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchScreamsAsync.fulfilled, (state, action) => {                
                state.screams = action.payload
            })
            .addCase(addScream.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addScream.fulfilled, (state, action) => {
                state.isLoading = false;
                state.screams = [action.payload, ...state.screams]
            })
            .addCase(likeAsync.fulfilled, (state, action) => {                
                const index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
                state.screams[index].likeCount += 1;
            })
            .addCase(unlikeAsync.fulfilled, (state, action) => {                
                const index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
                state.screams[index].likeCount -= 1;
            })
            .addCase(commentAsync.fulfilled, (state, action) => {
                const index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
                state.screams[index].commentCount += 1;
                state.allComments = [action.payload, ...state.allComments];
            })
            .addCase(fetchAllCommentsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllCommentsAsync.fulfilled, (state, action) => {
                state.allComments = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchRelatedScreams.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchRelatedScreams.fulfilled, (state, action) => {
                state.relatedComments = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAllLikes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllLikes.fulfilled, (state, action) => {
                state.likes = action.payload;
                state.isLoading = false;
            })
    }
});

export const { deleteScream, addRelatedComment } = screamSlice.actions;
export default screamSlice.reducer