import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, makeStyles, IconButton, Hidden } from "@material-ui/core";
import { useSelector, useDispatch } from 'react-redux';
import { logoutAsync } from '../features/users/userSlice';
import { useHistory } from 'react-router';
import { Menu } from '@material-ui/icons';
import SideDrawer from './SideDrawer';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { AddScream, Notifications } from './index';

const useStyles = makeStyles((theme) => ({
    menu: {
        position: 'absolute',
        left: 30,
        top: 12,
    },
    sideDrawer: {
        position: 'fixed',
        left: 20,
        top: 12,
    },
    addIcon: {
        color: 'white',
    },
    homeIcon: {
        color: 'white',
    },
    notificationsIcon: {
        color: 'white',
    },
    accountIcon: {
        color: 'white',
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        position: 'fixed',
        left: '5%',
        cursor: 'pointer',

    }
}));

const Navbar = () => {
    const classes = useStyles();
    const history = useHistory();
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);
    const imageUrl = useSelector(state => state.users.loginUser.credentials.imageUrl);
    console.log(imageUrl);
    
    const dispatch = useDispatch();
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

    return (
        <div>
            <AppBar>
                <Toolbar className='nav-container'>
                    <SideDrawer className={classes.sideDrawer} />
                    <Hidden only='xs'>
                        {isLoggedIn ?
                            <>
                                <img
                                    src={imageUrl} alt='userImage'
                                    className={classes.userImage}
                                    onClick={() => link('/profile')}
                                />
                                {/* <IconButton className={classes.accountIcon}>
                                    <AccountCircleIcon
                                        onClick={() => link('/profile')}
                                    />
                                </IconButton> */}
                                <div>
                                    <AddScream />
                                </div>
                                {/* <IconButton>
                                    <AddIcon className={classes.addIcon} />
                                </IconButton> */}
                                <IconButton>
                                    <HomeIcon
                                        className={classes.homeIcon}
                                        onClick={() => link('/')}
                                    />
                                </IconButton>
                                {/* <IconButton>
                                    <NotificationsIcon className={classes.notificationsIcon} />
                                </IconButton> */}
                                <Notifications />
                            </>
                            :
                            <>
                                <img
                                    src='https://firebasestorage.googleapis.com/v0/b/socialape-73b9a.appspot.com/o/person.jpg?alt=media&token=d747a225-5ee1-4528-b5d6-d6180bb21b86'
                                    alt='not logged in'
                                    className={classes.userImage}
                                    onClick={() => link('/profile')}
                                />
                                <Button color="inherit" component={Link} to='/'>Home</Button>
                                <Button color="inherit" component={Link} to='/login'>Login</Button>
                                <Button color="inherit" component={Link} to='/signup'>Signup</Button>
                            </>

                        }
                    </Hidden>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
