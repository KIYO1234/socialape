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
}));

const Navbar = () => {
    const classes = useStyles();
    const history = useHistory();
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);
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
                                <IconButton className={classes.accountIcon}>
                                    <AccountCircleIcon
                                        onClick={() => link('/profile')}
                                    />
                                </IconButton>
                                <IconButton>
                                    <AddIcon className={classes.addIcon} />
                                </IconButton>
                                <IconButton>
                                    <HomeIcon
                                        className={classes.homeIcon}
                                        onClick={() => link('/')}
                                    />
                                </IconButton>
                                <IconButton>
                                    <NotificationsIcon className={classes.notificationsIcon} />
                                </IconButton>
                            </>
                            :
                            <>
                                <Button color="inherit" component={Link} to='/login'>Login</Button>
                                <Button color="inherit" component={Link} to='/'>Home</Button>
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
