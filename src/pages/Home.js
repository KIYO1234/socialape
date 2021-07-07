import React from 'react';
import { makeStyles, Grid, Hidden } from '@material-ui/core';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Scream from '../components/Scream'
import { fetchScreamsAsync } from '../features/screams/screamSlice';
import { Loading, Profile } from '../components/index';

const useStyles = makeStyles((theme) => ({
    screamsContainer: {
        padding: '5%',
        paddingRight: 0,
    },
}));

const Home = () => {
    const classes = useStyles();
    const screams = useSelector(state => state.screams.screams)
    console.log(screams);

    const users = useSelector(state => state.users);
    console.log(users);

    // console.log(loginUser);
    // console.log(localStorage)

    // let recentScreamsMarkup = screams ? (screams.map((scream, index) => <Scream key={index} scream={scream} />)) : <p>Loading...</p>

    useEffect(() => {
        console.log('Home page rendered');
    }, []);

    if (screams.length > 0) {
        return (
            <div>
                <Grid
                    container
                    // spacing={10}
                    className={classes.screamsContainer}
                >
                    <Grid item sm={8} xs={12}>
                        {screams.map((scream, index) =>
                            <Scream key={index} scream={scream} />)
                        }
                    </Grid>
                    <Hidden only={['xs', 'sm']}>
                        <Grid item sm={4} xs={12}>
                            <Profile />
                        </Grid>
                    </Hidden>
                </Grid>
            </div>
        )
    } else {
        return <Loading text='Loading...' />
    }
}


export default Home