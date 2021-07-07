import React, { useEffect } from 'react';
import CommentIcon from '@material-ui/icons/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, IconButton, Button, Card, Grid } from '@material-ui/core';
import { useHistory } from 'react-router';
import { Loading } from '../components';
import { classicNameResolver } from 'typescript';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";

const useStyles = makeStyles({
    commentContainer: {
        marginBottom: 15,
        padding: '3%',
    },
    userImage: {
        maxWidth: 210,
        maxHeight: 200,
    },
    parentFlexContainer: {
        display: 'flex',
        // justifyContent: 'center',
    },
    commentBody: {
        // marginLeft: 80,
        marginRight: 'auto',
        marginLeft: 'auto',
        paddingLeft: 50,
        // textAlign: 'center',
    },
    userHandle: {
        // color: '#33c9dc',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15,
        // textAlign: 'center',

        // marginRight: 'auto',
        // marginLeft: 'auto',
    },
    pictureGrid: {
        // marginRight: 'auto',
        // marginLeft: 'auto',
    },
    imgContainer: {
        // marginRight: 'auto',
        // marginLeft: 'auto',
        textAlign: 'center',
    },
    timeText: {
        paddingLeft: 50,
        paddingTop: '5%',
        fontSize: 16,
    }
});

const CommentDetails = () => {
    const classes = useStyles();
    const allComments = useSelector(state => state.screams.allComments);
    const {screamId} = useParams();
    const reloadComments = allComments.filter(comment => comment.screamId === screamId);
    const isLoading = useSelector(state => state.screams.isLoading);
    dayjs.extend(relativeTime);
    
    if (!isLoading) {
        if (reloadComments.length > 0) {
            return (
                <div>
                    {reloadComments.map((comment, index) => (
                        <Card className={classes.commentContainer}>
                            <Grid container className={classes.parentFlexContainer}>
                                <Grid item xs={12} sm={5} className={classes.pictureGrid}>
                                    <div className={classes.imgContainer}>
                                        <img className={classes.userImage} src={comment.userImage} alt='pic' />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={5} className={classes.commentBody}>
                                    <div className={classes.userHandle}>{comment.userHandle}</div>
                                    {/* <div>Replying to {comment.}</div> */}
                                    <div key={index}>{comment.body}</div>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <div className={classes.timeText}>
                                        {dayjs(comment.createdAt).fromNow()}
                                    </div>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </div>
            )
        } else {
            return (
                <h1>No comments</h1>
            )
        }
    } else {
        return <Loading text='Loading...' />
    }
}

export default CommentDetails
