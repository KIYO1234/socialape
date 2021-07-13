import React from 'react';
import { makeStyles, Grid, Hidden } from '@material-ui/core';
import { useEffect } from 'react';
// import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
// import { useState } from 'react';
import Scream from '../components/Scream'
// import { setIsLikedByUser } from '../features/screams/screamSlice';
import { Loading, Profile } from '../components/index';

const useStyles = makeStyles((theme) => ({
    screamsContainer: {
        // padding: '5%',
        // paddingRight: 0,
    },
    screamArea: {
        width: '95%',
    }
}));

const Home = () => {    
    const dispatch = useDispatch();
    const classes = useStyles();
    const screams = useSelector(state => state.screams.screams)
    // console.log(screams);

    // const users = useSelector(state => state.users);
    // // console.log(users);

    // const handle = useSelector(state => state.users.loginUser.credentials.handle);

    // const likes = useSelector(state => state.screams.likes);
    // // console.log('likes', likes);
    // const likesByUser = likes.filter(like => like.userHandle === handle);
    // console.log('likesByUser', likesByUser);

    // useEffect(() => {
    //     console.log('home rendered')
    // }, [])
    
    // let isLikedByUser = []
    // for (let i = 0; i < screams.length; i++){
    //     isLikedByUser.push(likesByUser.findIndex(like => like.screamId === screams[i].screamId) !== -1)
    // }
    // console.log('isLikedByUser', isLikedByUser);
    

    // console.log(loginUser);
    // console.log(localStorage)

    // let recentScreamsMarkup = screams ? (screams.map((scream, index) => <Scream key={index} scream={scream} />)) : <p>Loading...</p>

    // useEffect(() => {
    //     let ownLikeArray = [];
    //     console.log('Home page rendered');
    //     for (let i = 0; i < screams.length; i++) {
    //         ownLikeArray.push(likesByUser.findIndex(like => like.screamId === screams[i].screamId) !== -1)
    //     }
    //     dispatch(setIsLikedByUser(ownLikeArray));
    // }, [screams]);

    if (screams.length > 0) {
        return (
            <div>
                <Hidden smDown>
                    <Grid
                        container
                        className={classes.screamsContainer}
                    >
                        <Grid item sm={8} xs={12} className={classes.screamArea}>
                            {screams.map((scream, index) =>
                                <Scream key={index} scream={scream} />
                            )}
                        </Grid>
                        <Hidden smDown>
                            <Grid item sm={4} xs={12}>
                                <Profile />
                            </Grid>
                        </Hidden>
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid
                        container
                        className={classes.screamsContainer}
                    >
                        <Grid item sm={12}>
                            {screams.map((scream, index) =>
                                <Scream
                                    key={index}
                                    scream={scream}    
                                />)
                            }
                        </Grid>
                        <Hidden smDown>
                            <Grid item sm={4} xs={12}>
                                <Profile />
                            </Grid>
                        </Hidden>
                    </Grid>
                </Hidden>
            </div>
        )
    } else {
        return <Loading text='Loading...' />
    }
}


export default Home