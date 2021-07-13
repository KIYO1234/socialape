import React from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';
import { useHistory } from 'react-router';
import Badge from '@material-ui/core/Badge';
import { markNotificationsRead } from '../features/users/userSlice';

// dayjs
dayjs.extend(require('dayjs/plugin/timezone'))
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.tz.setDefault('Asia/Tokyo');
console.log('time', dayjs.tz().format());

const useStyles = makeStyles({
    menu: {
        marginTop: 40,
    },
    notificationsIcon: {
        color: 'white',
    },
    favoriteIcon: {
        color: 'red',
        marginRight: 10,
    },
    commentIcon: {
        color: 'rgba(0, 0, 0, 0.6)',
        marginRight: 10,
    },
    notificationsContainer: {
        maxHeight: 100,
    }
});

const Notifications = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const notifications = useSelector(state => state.users.loginUser.notifications);
    console.log('notifications: ', notifications);
    const unReads = notifications.filter(notification => notification.read === false);
    // console.log('unReads: ', unReads);
    const unReadsNotificationIds = unReads.map(unread => unread.notificationId);
    // console.log('unReadsNotificationId', unReadsNotificationIds);
    
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {        
        setAnchorEl(event.currentTarget);
        if (notifications.length > 0) {
            dispatch(markNotificationsRead(unReadsNotificationIds))
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    dayjs.extend(relativeTime);

    const link = (path, screamId) => {
        history.push(path);
        handleClose();
    }
    const ITEM_HEIGHT = 48;


    return (
        <div className={classes.notificationsContainer}>
            <IconButton onClick={handleClick}>
                <Badge
                    badgeContent={unReads.length}
                    color='secondary'
                    max={99}
                >
                    <NotificationsIcon className={classes.notificationsIcon} />
                </Badge>
            </IconButton>
            <Menu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.menu}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 6.5,
                        width: 450,
                    },
                }}
            >
                {notifications.length > 0 ?
                    notifications.map((notification, index) =>
                        notification.type === 'like' ?
                            <MenuItem
                                onClick={() => link(`/users/${notification.recipient}/scream/${notification.screamId}`)}
                                key={index}
                            >
                                <FavoriteIcon className={classes.favoriteIcon}/>
                                <ListItemText>
                                    {`${notification.sender} liked your post ${dayjs(notification.createdAt).fromNow()} `}
                                </ListItemText>
                            </MenuItem> :
                            <MenuItem
                                onClick={() => link(`/users/${notification.recipient}/scream/${notification.screamId}`)}
                                key={index}
                            >
                                <CommentIcon className={classes.commentIcon} />
                                <ListItemText>
                                    {`${notification.sender} commented your post ${dayjs(notification.createdAt).fromNow()} `}
                                </ListItemText>
                            </MenuItem>
                    )
                    :
                    <MenuItem>
                        <ListItemText>
                            No notifications
                        </ListItemText>
                    </MenuItem>
                } 
            </Menu>
        </div>
    )
}

export default Notifications
