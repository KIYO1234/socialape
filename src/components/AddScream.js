import React, { useState } from 'react';
import { makeStyles, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { addScream, commentAsync } from '../features/screams/screamSlice';
import AddCommentIcon from '@material-ui/icons/AddComment';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
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
    addIcon: {
        color: 'white',
    },
    textFieldContainer: {
        position: 'relative',
    },
    clearIcon: {
        position: 'absolute',
        right: 10,
        bottom: 5,
    }
});

const AddScream = (props) => {
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);
    const screams = useSelector(state => state.screams.screams);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, control } = useForm()
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [newScream, setNewScream] = useState('');
    const handleScream = (event) => {
        setNewScream(event.target.value);
    }

    const submitScream = () => {
        if (isLoggedIn) {
            dispatch(addScream({body: newScream}));
            setNewScream('');
            handleClose();
        } else {
            alert('You are not logged in.\nPlease login.');
            handleClose();
        }
    }
    const clear = () => {
        setNewScream('');
    }

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <AddIcon className={classes.addIcon}  />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose} aria-labelledby="form-dialog-title"
                className={classes.dialog}
                fullWidth
            >   
                <DialogContent className={classes.textFieldContainer}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="scream"
                        label="What's new?"
                        type="text"
                        fullWidth
                        multiline
                        onChange={handleScream}
                        value={newScream}
                    />
                    {errors.scream && <p className={classes.errMessage}>{errors.scream.message}</p>}
                    <IconButton className={classes.clearIcon}>
                        <HighlightOffIcon onClick={clear} />
                    </IconButton>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>

                    <Button
                        onClick={submitScream}
                        color="primary"
                        disabled={false}
                    >
                        scream
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddScream
