import React from 'react'
import { makeStyles, Button, Paper, CardMedia, IconButton, Card } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import RoomIcon from '@material-ui/icons/Room';
import axios from 'axios';
import { setAuthorizationHeader, editUserDetails, logoutAsync } from '../features/users/userSlice';
import CreateIcon from '@material-ui/icons/Create';
import EditDetails from './EditDetails';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
    locationContainer: {
        display: 'flex',
        marginLeft: '10%',
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    calendarContainer: {
        display: 'flex',
        marginLeft: '10%',
        paddingBottom: '10%',
    },
    calendarIcon: {
        color: '#33c9dc',
    },
    calendarText: {
        margin: 0,
        marginLeft: 10,
    },
    profilePicture: {
        // height: '70%',
        // width: '70%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover',
    },
    profilePictureContainer: {
        paddingTop: 15,
        textAlign: 'center',
    },
    userName: {
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        color: '#33c9dc',
        fontSize: 30,
    },
    roomIcon: {
        color: '#33c9dc',
    },
    bioText: {
        textAlign: 'center',
        marginTop: '5%',
        marginBottom: '5%',
    },
    createIcon: {
        color: '#33c9dc',
    },
    logoutIcon: {
        color: '#33c9dc',
    },
    logoutIconContainer: {
        position: 'absolute',
        right: 5,
    },
    paper: {
        position: 'relative',
        width: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    notLoggedInCard: {
        padding: 30,
        paddingTop: 0,
    },
    buttonsContainer: {
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
    },
    signupBtn: {
        marginLeft: 30,
    }
}));

const Profile = () => {
    const history = useHistory();
    const classes = useStyles();
    const credentials = useSelector(state => state.users.loginUser.credentials);
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);

    const dispatch = useDispatch();
    const handleImageChange = (event) => {
        const image = event.target.files[0];
        // send to server
        const formData = new FormData();
        formData.append('image', image, image.name)
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        axios.post('/user/image', formData)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };
    // const getUserData = () => {
    //     const FBIdToken = localStorage.FBIdToken;
    //     axios.defaults.headers.common['Authorization'] = FBIdToken;
    //     dispatch(editUserDetails(credentials));
    // };
    const logout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await dispatch(logoutAsync());
            alert('Good Bye !');
            history.push('/');
        } else {
            alert('Canceled');
            return false;
        };
    };
    const link = (path) => {
        history.push(path);
    };

    if (isLoggedIn) {
        return (
            <>
                <Paper className={classes.paper}>
                    <div className={classes.profilePictureContainer}>
                        <img
                            src={credentials.imageUrl}
                            alt='profile'
                            className={classes.profilePicture}
                        />
                        {/* image upload */}
                        <input
                            type='file'
                            id='imageInput'
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className={classes.userName}>@{credentials.handle}</div>

                    <div className={classes.bioText}>{credentials.bio}</div>

                    <div className={classes.locationContainer}>
                        <RoomIcon className={classes.roomIcon} />
                        <div className={classes.calendarText}>{credentials.location}</div>
                    </div>

                    <div className={classes.calendarContainer}>
                        <CalendarTodayIcon
                            className={classes.calendarIcon}
                        />
                        <div className={classes.calendarText}>joined {new Date(credentials.createdAt).toDateString()}</div>
                    </div>

                    <EditDetails />
                    <IconButton
                        className={classes.logoutIconContainer}
                        onClick={logout}
                    >
                        <SubdirectoryArrowRightIcon className={classes.logoutIcon} />
                    </IconButton>
                    {/* <Button
                        onClick={getUserData}
                        color='primary'
                        variant='contained'
                    >getUserData</Button> */}

                </Paper>
            </>
        )
    } else {
        return (
            <>
                <Card className={classes.notLoggedInCard}>
                    <p>No profile found.</p>
                    <p>Please login or signup !</p>
                    
                    <div className={classes.buttonsContainer}>
                        <div>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => link('/login')}
                            >
                                login
                            </Button>
                        </div>
                        <div className={classes.signupBtn}>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => link('/signup')}
                            >
                                signup
                            </Button>
                        </div>
                    </div>
                </Card>
            </>
        )
    }
}

export default Profile
