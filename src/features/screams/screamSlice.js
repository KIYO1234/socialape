import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    screams: []
}

// Async
// fetchScreams
export const fetchScreamsAsync = createAsyncThunk(
    'screams/fetchScreamsAsync',
    async () => {
        console.log('fetchScreamAsync')
        
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
// like a scream
export const likeAsync = createAsyncThunk(
    'screams/likeAsync',
    async (selectedScream) => {
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        await axios.get(`/scream/${selectedScream[0].screamId}/like`)
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
        await axios.get(`/scream/${selectedScream[0].screamId}/unlike`).then(res => {
            console.log('likeAsync res.data', res.data)
        })
        return selectedScream;
    }
)

export const screamSlice = createSlice({
    name: 'screams',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScreamsAsync.fulfilled, (state, action) => {
                console.log('fetchScreamsAsync is fulfilled')
                
                state.screams = action.payload
            })
            .addCase(likeAsync.fulfilled, (state, action) => {
                const index = state.screams.findIndex(scream => scream.screamId === action.payload[0].screamId);
                state.screams[index].likeCount += 1;
            })
            .addCase(unlikeAsync.fulfilled, (state, action) => {
                const index = state.screams.findIndex(scream => scream.screamId === action.payload[0].screamId);
                state.screams[index].likeCount -= 1;
            })

    }
});

export default screamSlice.reducer