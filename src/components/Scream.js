import React, { useState } from 'react'
import { makeStyles, IconButton, Button } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
// Facebookとかでよくある（2 days ago）とかを作るやつ
import relativeTime from "dayjs/plugin/relativeTime";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useSelector, useDispatch } from 'react-redux';
import { likeAsync, unlikeAsync } from '../features/screams/screamSlice';
import CommentIcon from '@material-ui/icons/Comment';

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        marginBottom: 20,
        width: 450,
        height: 200,
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
}));

const Scream = (props) => {
    const screams = useSelector(state => state.screams.screams);
    const token = localStorage.FBIdToken;
    const dispatch = useDispatch();
    const classes = useStyles()
    dayjs.extend(relativeTime)
    const [like, setLike] = useState(false);
    const handleLike = () => {
        const selectedScream = screams.filter(scream => scream.screamId === props.scream.screamId);
        console.log(selectedScream);
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

                    <Typography
                        variant='body1'
                    >{props.scream.body}
                    </Typography>

                    <div className={classes.favoriteContainer}>
                        {props.scream.commentCount} comments
                        <IconButton>
                            <CommentIcon />
                        </IconButton>
                        {props.scream.likeCount} likes
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
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}

export default Scream;
