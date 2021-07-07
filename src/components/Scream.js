import React, { useState } from 'react'
import { makeStyles, IconButton, Button, Grid } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";
import { Link, useHistory } from 'react-router-dom';
import dayjs from "dayjs";
// Facebookとかでよくある（2 days ago）とかを作るやつ
import relativeTime from "dayjs/plugin/relativeTime";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useSelector, useDispatch } from 'react-redux';
import { getAllComments, likeAsync, unlikeAsync, deleteScream } from '../features/screams/screamSlice';
import CommentIcon from '@material-ui/icons/Comment';
import { Comment } from './index';
import AddCommentIcon from '@material-ui/icons/AddComment';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        marginBottom: 20,
        // width: 450,
        height: 250,
        width: '90%',
        // height: '60%',
        maxHeight: 300,
        position: 'relative',
    },

    image: {
        minWidth: 120,
        minHeight: 120,
    },
    content: {
        padding: 25,
        objectFit: "cover",
    },
    favoriteContainer: {
        position: 'absolute',
        right: 20,
        bottom: 5,
        marginTop: 10,
    },
    screamBody: {
        marginTop: 15,
    },
    addCommentContainer: {
        display: 'inlineBlock',
    },
    screamBodyContainer: {
        display: 'flex',
    },
    deleteContainer: {
        position: 'absolute',
        bottom: 0,
    }
}));

const Scream = (props) => {
    const history = useHistory();
    const screams = useSelector(state => state.screams.screams);
    const credentials = useSelector(state => state.users.loginUser.credentials);
    const token = localStorage.FBIdToken;
    const dispatch = useDispatch();
    const classes = useStyles();
    dayjs.extend(relativeTime);
    const [like, setLike] = useState(false);

    const selectedScream = screams.filter(scream => scream.screamId === props.scream.screamId);
    // console.log(selectedScream);
    const handleLike = () => {
        if (token) {
            if (like) {
                console.log('unlike');
                dispatch(unlikeAsync(selectedScream));
            } else {
                console.log('like');
                dispatch(likeAsync(selectedScream));
            }
            setLike(!like);
        } else {
            alert('You are not logged in. \n Please login.')
        }
    }

    const goToCommentDetails = () => {
        history.push(`comment/details/${props.scream.screamId}`);
    }

    const doDelete = (screamId) => {
        if (window.confirm('Are you sure you want to delete the scream?')) {
            dispatch(deleteScream(screamId));
        } else {
            alert('Canceled');
        }
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.image}
                    image={props.scream.userImage}
                    title='Profile image'
                />
                <CardContent className={classes.content}>
                    <Typography
                        variant='h5'
                        component={Link}
                        to={`/users/${props.scream.userHandle}`}
                        color='primary'
                    >{props.scream.userHandle}
                    </Typography>

                    <Typography
                        variant='body2'
                        color='textSecondary'
                    >{dayjs(props.scream.createdAt).fromNow()}
                    </Typography>

                    <div className={classes.screamBodyContainer}>
                        <div
                            variant='body1'
                            className={classes.screamBody}
                        >
                                {props.scream.body}
                        </div>
                        <Comment scream={props.scream} />
                    </div>


                    {/* comment */}
                    <div className={classes.favoriteContainer}>
                        {/* <Comment scream={props.scream}/> */}
                        <IconButton
                            onClick={goToCommentDetails}>
                            <CommentIcon/>
                        </IconButton>
                        {props.scream.commentCount}
                        {like ?
                            <IconButton onClick={handleLike}>
                                <FavoriteIcon
                                    color='secondary'
                                />
                            </IconButton> :
                            <IconButton onClick={handleLike}>
                                <FavoriteBorderIcon />
                            </IconButton>
                        }
                        {props.scream.likeCount}

                        {props.scream.userHandle === credentials.handle && 
                            <IconButton
                                onClick={() => doDelete(props.scream.screamId)}    
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    </div>
                   

                </CardContent>
            </Card>
        </div>
    )
}

export default Scream;
