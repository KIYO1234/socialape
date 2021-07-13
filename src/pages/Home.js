import React from 'react';
import { makeStyles, Grid, Hidden } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Scream from '../components/Scream'
import { Loading, Profile } from '../components/index';

const useStyles = makeStyles((theme) => ({
    screamArea: {
        width: '95%',
    }
}));

const Home = () => {    
    const classes = useStyles();
    const screams = useSelector(state => state.screams.screams)

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