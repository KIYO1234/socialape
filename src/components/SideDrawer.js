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
}));

const SideDrawer = () => {
    const history = useHistory();
    const classes = useStyles();
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

    return (
        <>
            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                <IconButton
                    onClick={toggleDrawer(true)}
                    className={classes.sideDrawer}
                >
                    <Menu
                        style={{ color: 'white' }}
                    />
                </IconButton>
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
                            <ListItem
                                button
                                onClick={() => link('/login')}
                            >
                                <ListItemText>LOGIN</ListItemText>
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => link('/signup')}
                            >
                                <ListItemText>SIGNUP</ListItemText>
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => link('/signup')}
                            >
                                <ListItemText>LOGOUT</ListItemText>
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => link('/')}
                            >
                                <ListItemText>ADD SCREAM</ListItemText>
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => link('/profile')}
                            >
                                <ListItemText>PROFILE</ListItemText>
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
            </Hidden>
        </>
    );
};

export default SideDrawer
