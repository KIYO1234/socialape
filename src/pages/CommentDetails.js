import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Card, Grid } from '@material-ui/core';
import { Loading } from '../components';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";

const useStyles = makeStyles({
    commentContainer: {
        marginBottom: 15,
        padding: '3%',
        width: '74%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    userImage: {
        width: 150,
        height: 150,
        borderRadius: '50%',
        objectFit: 'cover',
    },
    parentFlexContainer: {
        display: 'flex',
    },
    commentBody: {
        marginRight: 'auto',
        marginLeft: 'auto',
        paddingLeft: 50,
    },
    userHandle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    imgContainer: {
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
                        <Card
                            className={classes.commentContainer}
                            key={index}
                        >
                            <Grid container className={classes.parentFlexContainer}>
                                <Grid item xs={12} sm={4} className={classes.pictureGrid}>
                                    <div className={classes.imgContainer}>
                                        <img className={classes.userImage} src={comment.userImage} alt='pic' />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={5} className={classes.commentBody}>
                                    <div className={classes.userHandle}>{comment.userHandle}</div>
                                    <div key={index}>{comment.body}</div>
                                </Grid>
                                <Grid item xs={12} sm={3}>
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
