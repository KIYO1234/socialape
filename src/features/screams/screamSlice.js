import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    screams: [],
    comments: [],
    allComments: [],
    relatedComments: [],
    likes: [],
    isLoading: false,
}

// Async
// fetchScreams
export const fetchScreamsAsync = createAsyncThunk(
    'screams/fetchScreamsAsync',
    async () => {
        console.log('fetchScreamAsync');
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
        console.log('selected', selectedScream)
        
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        await axios.get(`/scream/${selectedScream.screamId}/like`)
            .then(res => {
                console.log('likeAsync res.data', res.data)
            })
            .catch(err => console.log(err));
        return selectedScream;
    }
)

// unlike a scream
export const unlikeAsync = createAsyncThunk(
    'screams/unlikeAsync',
    async (selectedScream) => {
        await axios.get(`/scream/${selectedScream.screamId}/unlike`).then(res => {
            console.log('likeAsync res.data', res.data)
        })
        return selectedScream;
    }
)

// Add a comment
export const commentAsync = createAsyncThunk(
    'screams/commentAsync',
    async (data) => {
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        console.log('commentAsync', data);
        let response;
        await axios.post(`/scream/${data.scream.screamId}/comment`, {body: data.comment})
            .then(res => {
                console.log(res.data);
                response = res.data;
            })
            .catch(err => {
                console.log(err);
            })
        return response;
    }
)

// // Get all comments (related to the selected scream)
// export const getAllComments = createAsyncThunk(
//     'screams/getAllComments',
//     async (screamId) => {
//         console.log(screamId);
//         let comments;
//         await axios.get(`/scream/${screamId}/comments`)
//             .then(res => {
//                 console.log(res.data)
//                 comments = res.data;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//         return comments;
//     }
// )

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
        console.log('screamId', screamId);
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
            console.log('addRelatedComment', action.payload);
            state.relatedComments = [action.payload, ...state.relatedComments];
            const index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
            console.log(index)
            
            // state.screams[index].commentCount += 1;
            state.allComments = [action.payload, ...state.allComments];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchScreamsAsync.fulfilled, (state, action) => {
                console.log('fetchScreamsAsync is fulfilled')
                
                state.screams = action.payload
            })
            .addCase(addScream.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addScream.fulfilled, (state, action) => {
                console.log('addScream fulfilled', action.payload);
                state.isLoading = false;
                state.screams = [action.payload, ...state.screams]
            })
            .addCase(likeAsync.fulfilled, (state, action) => {
                const index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
                state.screams[index].likeCount += 1;
            })
            .addCase(unlikeAsync.fulfilled, (state, action) => {
                console.log('unLikeAsync.fulfilled', action.payload);
                
                const index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
                state.screams[index].likeCount -= 1;
            })
            .addCase(commentAsync.fulfilled, (state, action) => {
                console.log('commentAsync fulfilled', action.payload);
                const index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
                state.screams[index].commentCount += 1;
                state.allComments = [action.payload, ...state.allComments];
            })
            // .addCase(getAllComments.fulfilled, (state, action) => {
            //     console.log('getAllComments fulfilled', action.payload);
            //     state.comments = action.payload;
            // })
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
                console.log('fetchRelatedScreams fulfilled', action.payload);
                state.relatedComments = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAllLikes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllLikes.fulfilled, (state, action) => {
                console.log('fetchAllLikes.fulfilled', action.payload);
                state.likes = action.payload;
                state.isLoading = false;
            })
    }
});

export const { deleteScream, addRelatedComment } = screamSlice.actions;
export default screamSlice.reducer