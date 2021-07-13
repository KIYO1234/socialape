import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Menu } from '@material-ui/icons';
import { IconButton, Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText, Hidden } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import AddIcon from '@material-ui/icons/Add';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { AddScream } from './index';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAsync } from '../features/users/userSlice';

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    sideDrawer: {
        position: 'fixed',
        left: 20,
        top: 3,
    },
    drawer: {
        width: 200,
    },
    addIconContainer: {
        position: 'fixed',
        top: 3,
        right: 20,
    },
    userImage: {
        // maxWidth: 50,
        width: 50,
        height: 50,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        // position: 'fixed',
        // left: '44%',
        cursor: 'pointer',
    },
}));

const SideDrawer = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const imageUrl = useSelector(state => state.users.loginUser.credentials.imageUrl);
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);

    const [open, setOpen] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };
    const link = (path) => {
        history.push(path);
    }
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

    return (
        <>
            <Hidden smUp>
                <IconButton
                    onClick={toggleDrawer(true)}
                    className={classes.sideDrawer}
                >
                    <Menu
                        style={{ color: 'white' }}
                    />
                </IconButton>
                {isLoggedIn ?
                    <>  
                        <div className={classes.addIconContainer}>
                            <AddScream />
                        </div>
                    
                        <Drawer
                            open={open}
                            anchor='left'
                            onClose={toggleDrawer(false)}
                        >
                            <div
                                role='presentation'
                                onClick={toggleDrawer(false)}
                                onKeyDown={toggleDrawer(false)}
                                className={classes.drawer}
                            >
                                <List>
                                    <ListItem>
                                        <img
                                            src={imageUrl} alt='userImage'
                                            className={classes.userImage}
                                            onClick={() => link('/profile')}
                                        />
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        button
                                        onClick={() => link('/')}
                                    >
                                        <ListItemText>HOME</ListItemText>
                                        <HomeIcon />
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        button
                                        onClick={logout}
                                    >
                                        <ListItemText>LOGOUT</ListItemText>
                                    </ListItem>
                                    <Divider />
                                </List>
                            </div>
                        </Drawer>
                    </>
                    :
                    <>
                        <div className={classes.addIconContainer}>
                            <AddScream />
                        </div>

                        <Drawer
                            open={open}
                            anchor='left'
                            onClose={toggleDrawer(false)}
                        >
                            <div
                                role='presentation'
                                onClick={toggleDrawer(false)}
                                onKeyDown={toggleDrawer(false)}
                                className={classes.drawer}
                            >
                                <List>
                                    <ListItem
                                        button
                                        onClick={() => link('/')}
                                    >
                                        <ListItemText>HOME</ListItemText>
                                        <HomeIcon />
                                    </ListItem>
                                    <Divider/>
                                    <ListItem
                                        button
                                        onClick={() => link('/login')}
                                    >
                                        <ListItemText>LOGIN</ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem
                                        button
                                        onClick={() => link('/signup')}
                                    >
                                        <ListItemText>SIGNUP</ListItemText>
                                    </ListItem>
                                    <Divider />
                                </List>
                            </div>
                        </Drawer>
                    </>
                }
                
            </Hidden>
        </>
    );
};

export default SideDrawer
