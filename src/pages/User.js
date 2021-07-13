import React, { useEffect, useState } from 'react';
import { Card, IconButton, Divider, Hidden, Grid } from '@material-ui/core';
import { useParams, useHistory } from 'react-router';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Loading } from '../components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DateRangeIcon from '@material-ui/icons/DateRange';
import dayjs from "dayjs";
import ScheduleIcon from '@material-ui/icons/Schedule';
import relativeTime from "dayjs/plugin/relativeTime";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/Comment';

const useStyles = makeStyles({
    userImage: {
        width: 150,
        height: 150,
        objectFit: 'cover',
        borderRadius: '50%',
        display: 'block',
        cursor: 'pointer',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    smDownUserImage: {
        width: 150,
        height: 150,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        cursor: 'pointer',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    cardContainer: {
        padding: '5%',
        paddingTop: 5,
        maxWidth: 700,
    },
    flexContainer: {
        display: 'flex',
    },
    userNameText: {
        fontSize: 30,
        color: '#33c9dc',
        marginBottom: 15,
    },
    smDownUserNameText: {
        fontSize: 30,
        color: '#33c9dc',
        textAlign: 'center',
        marginTop: 20,
    },
    descContainer: {
        marginLeft: '10%',
    },
    dateDetail: {
        position: 'relative',
    },
    smDownDateDetail: {
        position: 'relative',
        textAlign: 'center',
        marginTop: 20,
    },
    dateIcon: {
        color: 'rgba(0, 0, 0, 0.6)',
    },
    dateText: {
        position: 'absolute',
        top: 3,
        left: 50,
    },
    smDownDateText: {
        paddingTop: 3,
        marginLeft: 10,
    },
    screamCard: {
        padding: '5%',
        paddingTop: 20,
        paddingLeft: '5%',
        marginTop: 20,
        maxWidth: 700,
    },
    userScreamImage: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        cursor: 'pointer',
    },
    screamTopContainer: {
        display: 'flex',
    },
    topText: {
        marginLeft: '5%',
        paddingTop: 5,
    },
    userName: {
        fontSize: 26,
        color: '#33c9dc',
    },
    timeText: {
        marginLeft: 10,
        position: 'relative',
    },
    timeIcon: {
        position: 'absolute',
    },
    createdAt: {
        marginLeft: 35,
    },
    divider: {
        marginTop: 5,
        marginBottom: 5,
    },
    screamBody: {
        padding: 15,
    },
    hiddenFlex: {
        display: 'flex',
    },
    smCardContainer: {
        marginTop: 20,
        marginLeft: 50,
        width: 350,
        maxHeight: 500,
    },
    screamsArea: {
        flexGrow: 2,
    },
    bio: {
        marginTop: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
    },
    dateContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    iconsContainer: {
        textAlign: 'right',
        position: 'relative',
        width: '90%',
    },
    favoriteIcon: {
        marginLeft: 30,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    commentCount: {
        position: 'absolute',
        marginLeft: 10,
        marginRight: 10,
    },
    likeCount: {
        position: 'absolute',
        marginLeft: 10,
    },
    timeContainer: {
        position: 'relative',
        marginTop: 10,
        marginBottom: 10,
    },
    imgGrid: {
        textAlign: 'center',
    },
    iconColor: {
        color: 'rgba(0, 0, 0, 0.6)',
    },
})

const User = () => {
    const history = useHistory();
    const classes = useStyles();
    const [userData, setUserData] = useState();
    
    const { handle } = useParams();
    dayjs.extend(relativeTime);
    useEffect(() => {
        axios.get(`/user/${handle}`)
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => console.log(err)
        )
    }, [handle])
    const link = (path) => {
        history.push(path);
    };
    
    if (userData) {
        return (
            <>
                <Hidden mdUp>
                    <Card className={classes.cardContainer}>
                        <IconButton onClick={() => link('/')}>
                            <ArrowBackIcon />
                        </IconButton>
                        <div className={classes.flexContainer}>
                            <Grid container>
                                <Grid item xs={12} sm={4}>
                                    <div className={classes.imgGrid}>
                                        <img
                                            src={userData.user.imageUrl} alt='profile'
                                            className={classes.userImage}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={8}>     
                                    <div className={classes.descContainer}>
                                        <div className={classes.userNameText}>
                                            {userData.user.handle}
                                        </div>
                                        <p>
                                            {userData.user.bio}
                                        </p>
                                        <p className={classes.dateDetail}>
                                            <DateRangeIcon className={classes.dateIcon}/>
                                            <span className={classes.dateText}>

                                            Joined {dayjs(userData.user.createdAt).format('MMMM D, YYYY')}
                                            </span>
                                        </p>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Card>
                </Hidden>
                <div className={classes.hiddenFlex}>
                    <div className={classes.screamsArea}>

                        {userData.screams.map(scream => (
                            <Card className={classes.screamCard}>
                                <div className={classes.screamTopContainer}>
                                    <div>
                                        <img
                                            src={userData.user.imageUrl} alt='profile'
                                            className={classes.userScreamImage}
                                        />
                                    </div>
                                    <div className={classes.topText}>
                                        <span className={classes.userName}>
                                            {scream.userHandle}
                                        </span>
                                        <span className={classes.timeText}>
                                        </span>
                                    </div>
                                </div>
                                <div className={classes.timeContainer}>
                                    <span className={classes.timeIcon}>
                                        <ScheduleIcon
                                            className={classes.iconColor}
                                            fontSize='small' />
                                    </span>
                                    <span className={classes.createdAt}>
                                        {dayjs(scream.createdAt).fromNow()}
                                    </span>
                                </div>
                                <Divider className={classes.divider} />
                                <div className={classes.screamBody}>
                                    {scream.body}
                                </div>
                                <div className={classes.iconsContainer}>
                                    <CommentIcon className={classes.iconColor} />
                                    <span className={classes.commentCount}>
                                        {scream.commentCount}
                                    </span>
                                    <FavoriteBorderIcon
                                        className={classes.favoriteIcon} />
                                    <span className={classes.likeCount}>
                                        {scream.likeCount}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <Hidden smDown>
                        <Card className={classes.smCardContainer}>
                            <IconButton onClick={() => link('/')}>
                                <ArrowBackIcon />
                            </IconButton>
                            <div>
                                <div>
                                    <img
                                        src={userData.user.imageUrl} alt='profile'
                                        className={classes.smDownUserImage}
                                    />
                                </div>
                                <div>
                                    <div className={classes.smDownUserNameText}>
                                        {userData.user.handle}
                                    </div>
                                    <div className={classes.bio}>
                                        <span className={classes.bio}>
                                        {userData.user.bio}
                                        </span>
                                    </div>
                                    <div className={classes.smDownDateDetail}>
                                        <div className={classes.dateContainer}>
                                            <div className={classes.smDownDateIcon}>
                                                <DateRangeIcon />
                                            </div>
                                            <div className={classes.smDownDateText}>
                                                Joined {dayjs(userData.user.createdAt).format('MMM YYYY')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Hidden>
                </div>
            </>
        )
    } else {
        return <Loading text='Loading...' />
    }
}

export default User
