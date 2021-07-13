import React, { useState } from 'react';
import { makeStyles, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { addRelatedComment, commentAsync } from '../features/screams/screamSlice';
import AddCommentIcon from '@material-ui/icons/AddComment';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';


const useStyles = makeStyles({
    dialog: {
        width: '90%',
        height: '90%',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    errMessage: {
        color: 'red',
        fontSize: 14,
    },
    maximumLength: {
        color: 'red',
        fontSize: 18,
        marginLeft: 20,
    },
    textFieldContainer: {
        position: 'relative',
    },
    clearIcon: {
        position: 'absolute',
        right: 10,
        bottom: 5,
    },
});

const RelatedComment = (props) => {
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);
    const handle = useSelector(state => state.users.loginUser.credentials.handle);
    const imageUrl = useSelector(state => state.users.loginUser.credentials.imageUrl);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const [comment, setComment] = useState('');
    const handleClose = () => {
        setOpen(false);
        setComment('');
    };
    const handleComment = (event) => {
        setComment(event.target.value);
    };
    const onSubmit = () => {
        if (isLoggedIn) {
            dispatch(commentAsync({ comment: comment, scream: props.scream }));
            const data = {
                body: comment,
                createdAt: new Date().toISOString(),
                screamId: props.scream.screamId,
                userHandle: handle,
                userImage: imageUrl,
            }
            dispatch(addRelatedComment(data));
            handleClose();
            setComment('');
        } else {
            alert('You are not logged in.\nPlease login.');
        };
    };
    const clear = () => {
        setComment('');
    };

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <AddCommentIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose} aria-labelledby="form-dialog-title"
                className={classes.dialog}
                fullWidth
            >
                <DialogTitle id="form-dialog-title">Comment</DialogTitle>
                <DialogContent className={classes.textFieldContainer}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="comment"
                        label="Put your comments here"
                        type="text"
                        fullWidth
                        value={comment}
                        multiline
                        onChange={handleComment}
                    />
                    <IconButton className={classes.clearIcon}>
                        <HighlightOffIcon onClick={clear} />
                    </IconButton>
                </DialogContent>
                {comment.length > 140 &&
                    <div className={classes.maximumLength}>Maximum length is 140</div>
                }
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>

                    {comment && comment.length <= 140 ?
                        <Button
                            onClick={() => onSubmit()}
                            color="primary"
                            disabled={false}
                            type='submit'
                        >
                            submit
                        </Button>
                        :
                        <Button
                            onClick={() => onSubmit()}
                            color="primary"
                            disabled={true}
                            type='submit'
                        >
                            submit
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </>
    )
}

export default RelatedComment
