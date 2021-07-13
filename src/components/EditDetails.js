import React, { useState, useEffect } from 'react';
import { makeStyles, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { changeUserDetails, changeUserDetailsAsync } from '../features/users/userSlice';

const useStyles = makeStyles((theme) => ({
    createIcon: {
        color: '#33c9dc',
    },
    // editDetailContainer: {
    //     position: 'relative',
    //     left: 200,
    // }
}));

const EditDetails = () => {
    const dispatch = useDispatch();
    const credentials = useSelector(state => state.users.loginUser.credentials);
    // console.log(credentials);
    useEffect(() => {
        if (credentials) {
            setBio(credentials.bio);
            setLocation(credentials.location);
        }
    }, [credentials]);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [bio, setBio] = useState();
    const handleBio = (event) => {
        setBio(event.target.value);
    }
    const [location, setLocation] = useState();
    const handleLocation = (event) => {
        setLocation(event.target.value);
    }

    const change = async () => {
        if (bio === credentials.bio && location === credentials.location) {
            alert('Please change something');
        } else {
            // dispatch(changeUserDetails({bio: bio, location: location}));
            // await axios.post('/user', {bio: bio, location: location})
            dispatch(changeUserDetailsAsync({ bio: bio, location: location }))
            alert('changed');
            setOpen(false);
        }
    }


    if (credentials) {
        return (
            <>
                <IconButton
                    onClick={handleClickOpen}
                    // className={classes.editDetailContainer}
                >
                    <CreateIcon className={classes.createIcon} />
                </IconButton>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You can edit your details here.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="bio"
                            label="bio"
                            type="text"
                            fullWidth
                            defaultValue={credentials.bio}
                            onChange={handleBio}
                            multiline
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="location"
                            label="location"
                            type="text"
                            fullWidth
                            defaultValue={credentials.location}
                            onChange={handleLocation}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        {bio && bio.length <= 140 ?
                            <Button
                                onClick={change} color="primary"
                                disabled={false}
                            >
                                Change
                            </Button>
                            :
                            <Button
                                onClick={change} color="primary"
                                disabled={true}
                            >
                                Change
                            </Button>
                        }
                    </DialogActions>
                </Dialog>
            </>
        )
    } else {
        return <></>
    }
}

export default EditDetails
