import React, { useState, useEffect } from 'react'
import { makeStyles, IconButton, Button, Grid } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";
import { Link, useHistory } from 'react-router-dom';
import dayjs from "dayjs";
// Facebookとかでよくある（2 days ago）とかを作るやつ
import relativeTime from "dayjs/plugin/relativeTime";
import utc from 'dayjs/plugin/utc';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useSelector, useDispatch } from 'react-redux';
import { getAllComments, likeAsync, unlikeAsync, deleteScream } from '../features/screams/screamSlice';
import CommentIcon from '@material-ui/icons/Comment';
import { Comment } from './index';
import AddCommentIcon from '@material-ui/icons/AddComment';
import DeleteIcon from '@material-ui/icons/Delete';
import { SettingsBackupRestore } from '@material-ui/icons';
import { isPropertyAccessExpression } from 'typescript';

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        marginBottom: 20,
        // width: 450,
        height: 250,
        width: '75%',
        minWidth: 250,
        // height: '60%',
        maxHeight: 200,
        position: 'relative',
        paddingLeft: '5%',
        paddingTop: '5%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    image: {
        // minWidth: 120,
        // minHeight: 120,
        cursor: 'pointer',
        width: 120,
        height: 120,
        borderRadius: '50%',
        objectFit: 'cover',
    },
    content: {
        padding: 25,
        paddingTop: 0,
        paddingRight: 5,
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
        cursor: 'pointer',
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
    const handle = useSelector(state => state.users.loginUser.credentials.handle);
    const token = localStorage.FBIdToken;
    const dispatch = useDispatch();
    const classes = useStyles();
    dayjs.extend(relativeTime);
    
    const selectedScream = screams.filter(scream => scream.screamId === props.scream.screamId);
    
    const handleLike = () => {
        if (token) {
            dispatch(likeAsync(selectedScream[0]));
            setLike(true);
        } else {
            alert('You are not logged in. \n Please login.')
        };
    };
    const handleUnlike = () => {
        if (token) {
            dispatch(unlikeAsync(selectedScream[0]));
            setLike(false);
        } else {
            alert('You are not logged in. \n Please login.')
        };
    }
    
    const goToCommentDetails = () => {
        history.push(`comment/details/${props.scream.screamId}`);
    };
    
    const doDelete = (screamId) => {
        if (window.confirm('Are you sure you want to delete the scream?')) {
            dispatch(deleteScream(screamId));
        } else {
            alert('Canceled');
        }
    };
    
    const link = (path) => {
        history.push(path);
    };
    
    const [like, setLike] = useState(false);
    // console.log('like', like);
    
    // const likes = useSelector(state => state.screams.likes);
    // const likesByUser = likes.filter(like => like.userHandle === handle);
    
    

    // useEffect(() => {
    //     // alert('reload');
    //     console.log('screams rendered');
    //     if (likesByUser.length > 0) {
    //         if (likesByUser.findIndex(like => like.screamId === props.scream.screamId) !== -1) {            
    //             setLike(true);
    //         } else {
    //             setLike(false);
    //         };
    //     }
    // }, []);
    dayjs.extend(utc);
    const now = dayjs.utc().local().format();
    // console.log('now: ', now);
    
    return (
        <div>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.image}
                    image={props.scream.userImage}
                    title='Profile image'
                    onClick={() => link(`/users/${props.scream.userHandle}`)}
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
                            onClick={() => link(`/users/${props.scream.userHandle}/scream/${props.scream.screamId}`)}
                        >
                                {props.scream.body}
                        </div>
                        <Comment scream={props.scream} />
                    </div>


                    {/* comment */}
                    <div className={classes.favoriteContainer}>
                        <IconButton
                            onClick={goToCommentDetails}>
                            <CommentIcon/>
                        </IconButton>
                        {props.scream.commentCount}
                        {like ?
                            <IconButton onClick={handleUnlike}>
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
