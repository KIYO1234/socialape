import React, { useState, useEffect } from 'react'
import { makeStyles, IconButton, Grid } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";
import { Link, useHistory, useParams } from 'react-router-dom';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useSelector, useDispatch } from 'react-redux';
import { likeAsync, unlikeAsync, deleteScream, fetchRelatedScreams } from '../features/screams/screamSlice';
import CommentIcon from '@material-ui/icons/Comment';
import { RelatedComment } from '../components/index';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { Loading } from '../components/index';

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        marginBottom: 20,
        height: 250,
        width: '75%',
        minWidth: 250,
        maxHeight: 200,
        position: 'relative',
        paddingLeft: '5%',
        paddingTop: '5%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    image: {
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
    },
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
}));

const EachScream = () => {
    const history = useHistory();
    const credentials = useSelector(state => state.users.loginUser.credentials);
    const token = localStorage.FBIdToken;
    const dispatch = useDispatch();
    const classes = useStyles();
    dayjs.extend(relativeTime);
    const [like, setLike] = useState(false);
    const { screamId } = useParams();
    const [userData, setUserData] = useState();
    const relatedComments = useSelector(state => state.screams.relatedComments);
    const screams = useSelector(state => state.screams.screams);
    
    const chosenScream = screams.filter(scream => scream.screamId === screamId);
    const relatedScream = (chosenScream[0]);    
    
    useEffect(() => {
        if (screamId) {            
            dispatch(fetchRelatedScreams(screamId))
        } else {
            return
        }
    }, [dispatch, screamId])

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

    let scream = '';
    if (userData) {
        const screams = userData.screams;
        const selectedScream = screams.filter(scream => scream.screamId === screamId);
        scream = selectedScream[0];
    }

    const doDelete = (screamId) => {
        if (window.confirm('Are you sure you want to delete the scream?')) {
            dispatch(deleteScream(screamId));
            alert('deleted');
            history.push('/');
        } else {
            alert('Canceled');
        }
    };
    
    const handleLike = () => {
        if (token) {
            dispatch(likeAsync(scream));
            setLike(!like);
        } else {
            alert('You are not logged in. \n Please login.')
        };
    }
    const handleUnlike = () => {
        if (token) {
            dispatch(unlikeAsync(scream));
            setLike(!like);
        } else {
            alert('You are not logged in. \n Please login.')
        };
    }

    const goToCommentDetails = () => {
        history.push(`/comment/details/${scream.screamId}`);
    };

    const link = (path) => {
        history.push(path);
    };

    if (userData && relatedComments) {
        return (
            <div>
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.image}
                        image={scream.userImage}
                        title='Profile image'
                        onClick={() => link(`/users/${scream.userHandle}`)}
                    />
                    <CardContent className={classes.content}>
                        <Typography
                            variant='h5'
                            component={Link}
                            to={`/users/${scream.userHandle}`}
                            color='primary'
                        >{scream.userHandle}
                        </Typography>
    
                        <Typography
                            variant='body2'
                            color='textSecondary'
                        >{dayjs(scream.createdAt).fromNow()}
                        </Typography>
    
                        <div className={classes.screamBodyContainer}>
                            <div
                                variant='body1'
                                className={classes.screamBody}
                                onClick={() => link(`/users/${scream.userHandle}/scream/${scream.screamId}`)}
                            >
                                {scream.body}
                            </div>
                            <RelatedComment scream={scream} />
                        </div>
    
                        <div className={classes.favoriteContainer}>
                            <IconButton
                                onClick={goToCommentDetails}>
                                <CommentIcon />
                            </IconButton>
                            
                            {relatedScream && relatedScream.commentCount}
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
                            {relatedScream && relatedScream.likeCount}
    
                            {scream.userHandle === credentials.handle &&
                                <IconButton
                                    onClick={() => doDelete(scream.screamId)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        </div>
                    </CardContent>
                </Card>
                {relatedComments.map((comment, index) => (
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
        return <Loading text='Loading...' />
    }
}

export default EachScream;
