import React, { useEffect } from 'react'
import { makeStyles, Button, Paper, CardMedia, IconButton, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import RoomIcon from '@material-ui/icons/Room';
import axios from 'axios';
import {
    setAuthorizationHeader,
    editUserDetails,
    logoutAsync,
    updateImageAsync,
} from '../features/users/userSlice';
import CreateIcon from '@material-ui/icons/Create';
import EditDetails from './EditDetails';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import { useHistory } from 'react-router';
import firebase from 'firebase'
import Loading from './Loading';

const useStyles = makeStyles((theme) => ({
    locationContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    calendarContainer: {
        display: 'flex',
        justifyContent: 'center',
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
        width: '60%',
        height: '60%',
    },
    profilePictureContainer: {
        paddingTop: '10%',
        textAlign: 'center',
    },
    userName: {
        paddingTop: '10%',
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
    paper: {
        position: 'relative',
    },
    gridContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'center',
    },
    iconsContainer: {
        textAlign: 'right',
    },
}));

const ProfileSingle = () => {
    const history = useHistory();
    const classes = useStyles();
    const credentials = useSelector(state => state.users.loginUser.credentials);
    const handle = useSelector(state => state.users.loginUser.credentials.handle);
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);
    const isLoading = useSelector(state => state.users.isLoading);
    console.log(isLoading);
    
    useEffect(() => {
        console.log('profile single rendered', credentials.imageUrl);
        console.log('profile single rendered', credentials);
    }, []);

    const dispatch = useDispatch();
    const handleImageChange = async(event) => {
        const file = event.target.files[0];
        // console.log(file);
        // console.log(file.name);
        await dispatch(updateImageAsync({ file: file, handle: handle }));
        // alert('Your image has been updated successfully !');
        // history.push('/');

        // send to server
        // const formData = new FormData();
        // formData.append('file', file, file.name)

        // // Send to server(一旦なし)
        // const FBIdToken = localStorage.FBIdToken;
        // axios.defaults.headers.common['Authorization'] = FBIdToken;
        // axios.post('/user/image', file.name)
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err));

        // // 直接Firebaseへアップロード
        // const storageRef = firebase.storage().ref(file.name);
        // console.log(storageRef);

        // // firebase.storage().ref(file.name).put(file)
        // storageRef.put(file)
        //     .then(res => {
        //         console.log('upload image successfully', res);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    };

    const getUserData = () => {
        const FBIdToken = localStorage.FBIdToken;
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        dispatch(editUserDetails(credentials));
    };
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


    if (!isLoading) {
        
        if (isLoggedIn) {
            return (
                <div className={classes.parentContainer}>
                    <Paper className={classes.paper}>
                        <Grid container className={classes.gridContainer}>
                            <Grid item xs={12} sm={6} >
                                <div className={classes.profilePictureContainer}>
                                    <img
                                        src={credentials.imageUrl}
                                        alt='profile'
                                        className={classes.profilePicture}
                                    />
                                    {/* image upload */}
                                    <br />
                                    <input
                                        type='file'
                                        id='imageInput'
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} >
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
    
                                <div className={classes.iconsContainer}>
                                    <EditDetails />
                                    <IconButton onClick={logout}>
                                        <SubdirectoryArrowRightIcon className={classes.logoutIcon} />
                                    </IconButton>
                                </div>
                            </Grid>
    
                        </Grid>
    
                    </Paper>
                </div>
            )
        } else {
            return (
                <> 
                    <div>You are not logged in</div>
                </>
            )
        }
    } else {
        return  <Loading text='Image uploading...' />
    }
}

export default ProfileSingle
