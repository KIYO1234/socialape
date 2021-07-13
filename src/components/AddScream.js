import React, { useState } from 'react';
import { makeStyles, IconButton, TextField, Dialog, DialogActions, DialogContent, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { addScream } from '../features/screams/screamSlice';
import AddIcon from '@material-ui/icons/Add';
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
    },
    maximumLength: {
        color: 'red',
        fontSize: 18,
        marginLeft: 20,
    }
});

const AddScream = () => {
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);
    const dispatch = useDispatch();
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
    };
    const submitScream = () => {
        if (isLoggedIn) {
            dispatch(addScream({ body: newScream }));
            setNewScream('');
            handleClose();
        } else {
            alert('You are not logged in.\nPlease login.');
            handleClose();
        };
    };
    const cancel = () => {
        handleClose();
        setNewScream('');
    };
    const clear = () => {
        setNewScream('');
    };

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
                    <IconButton className={classes.clearIcon}>
                        <HighlightOffIcon onClick={clear} />
                    </IconButton>
                </DialogContent>
                {newScream.length > 140 &&
                    <div className={classes.maximumLength}>Maximum length is 140</div>
                }
                <DialogActions>
                    <Button onClick={cancel} color="primary">
                        Cancel
                    </Button>

                    {newScream && newScream.length <= 140 ?
                        <Button
                            onClick={submitScream}
                            color="primary"
                            type='submit'
                            disabled={false}
                        >
                            scream
                        </Button>
                        :
                        <Button
                            onClick={submitScream}
                            color="primary"
                            type='submit'
                            disabled={true}
                        >
                            scream
                        </Button>
                    }

                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddScream
