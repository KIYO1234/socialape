import React, { useState } from 'react';
import { makeStyles, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { commentAsync } from '../features/screams/screamSlice';
import AddCommentIcon from '@material-ui/icons/AddComment';


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
});

const Comment = (props) => {
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);    
    
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm()
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    const onSubmit = (data) => {
        if (isLoggedIn) {
            dispatch(commentAsync({ comment: data.comment, scream: props.scream }));
            handleClose();
        } else {
            alert('You are not logged in.\nPlease login.');
            handleClose();
        }
    }
    
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="comment"
                                label="Put your comments here"
                                type="text"
                                fullWidth
                                // value={comment}
                                multiline
                                // onChange={handleComment}
                                {...register('comment', { required: 'Must not be empty' })}
                            />
                            {errors.comment && <p className={classes.errMessage}>{errors.comment.message}</p>}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                        
                            <Button
                                // onClick={change}
                                color="primary"
                                disabled={false}
                                type='submit'
                            >
                                submit
                            </Button>
                        
                        </DialogActions>
                    </form>
            </Dialog>
        </>
    )
}

export default Comment
