import React, { useState, useCallback } from 'react'
import TextField from "@material-ui/core/TextField";
import { makeStyles, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AppIcon from '../images/roundChat.jpeg'
import Typography from "@material-ui/core/Typography";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { fetchLoginUserAsync, login } from '../features/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { convertCompilerOptionsFromJson } from 'typescript';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';


const useStyles = makeStyles((theme) => ({
    form: {
        textAlign: 'center',
    },
    image: {
        margin: '20px auto 20px auto',
        width: 60,
        height: 60,
        borderRadius: '50%',
    },
    errMessage: {
        color: "red",
        fontSize: 14,
    },
    pageTitle: {
        margin: '0 auto 20px auto',
    },
    loginBtn: {
        marginTop: 20,
        position: 'relative',
    },
    toSignupMsg: {
        marginTop: 20,
    },
    progress: {
        position: 'absolute',
    },
    passwordArea: {
        position: 'relative',
    },
    visibilityIcon: {
        position: 'absolute',
        right: 0,
        top: 20,
        cursor: 'pointer',
    },
    textFieldContainer: {
        position: 'relative',
    },
    clearIcon: {
        position: 'absolute',
        right: -12,
        top: 5,
    },
    field: {
        width: '80%'
    },
    mainGrid: {
        width: '100%',
    }
}));

const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const { register, handleSubmit, formState: { errors }, reset,} = useForm();
    const isLoading = useSelector(state => state.users.isLoading);
    const isLoggedIn = useSelector(state => state.users.isLoggedIn)
    const error = useSelector(state => state.users.error);
    // useState
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleEmail = useCallback((event) => {
        setEmail(event.target.value);
    }, [setEmail]);
    const handlePassword = useCallback((event) => {
        setPassword(event.target.value);
    }, [setPassword]);

    // handlers
    const handleType = () => {
        setVisible(!visible)
    };
    const clear = () => {
        setEmail('');
    };

    // functions
    const onSubmit = async () => {
        // let error = ''
        // await dispatch(fetchLoginUserAsync(data))
        //     .then(res => console.log('login res: ', res))
        //     .catch(err => {
        //         console.log('login err: ', err);
        //         error = err;
        //         console.log('error', error);
        //         if (error) {
        //             alert('error occurred')
        //         } else {
        //             history.push('/');
        //         }
        //     });

        // ---------------------------------
        // try catch
        // try {
        //     await dispatch(fetchLoginUserAsync(data))
        //         .then(res => console.log('login res: ', res))
        //     // history.push('/');
        // } catch (err) {
        //     let error;
        //     console.log('login err: ', err);
        //     error = err;
        //     console.log('error', error);
        //     return
        //     // if (error) {
        //     //     alert('error occurred')
        //     // } else {
        //     //     history.push('/');
        //     // }
        //     // };
        // }
        // --------------------------------
    
        dispatch(fetchLoginUserAsync({ email: email, password: password })).then(res => {
            console.log(res)
        })
    }

    if (!error && isLoggedIn) {
        history.push('/')
    }    

    if (!isLoading) {
        return (
            <div>
                <Grid container className={classes.form}>
                    <Grid item md sm={3} xs={2}/>
                    <Grid item md sm={6} xs={8} className={classes.mainGrid}>
                        <img className={classes.image} src={AppIcon} alt="monkey" />
                        <Typography
                            variant="h5"
                            className={classes.pageTitle}
                        >Login
                        </Typography>
    
                        {/* <form onSubmit={handleSubmit(onSubmit)}> */}

                        <div className={classes.textFieldContainer}>
                            <TextField
                                label="Email"
                                autoComplete='email'
                                onChange={handleEmail}
                                value={email}
                                    type='search'
                                    fullWidth
                                // {...register('email', {
                                //     required: 'Email must not empty',
                                //     pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                // })}
                            ></TextField>
                            {/* {errors.email && <p className={classes.errMessage}>{errors.email.message}</p>}
                            <p className={classes.errMessage}>
                                {errors.email?.type === "pattern" && "Your Email address is invalid type"}
                            </p> */}
                            {/* <IconButton
                                className={classes.clearIcon}
                                onClick={clear}
                            >
                                <HighlightOffIcon />
                            </IconButton> */}
                        </div>
                    
                        {/* password */}
                        <div className={classes.passwordArea}>
                            <TextField
                                label="Password"
                                autoComplete='current-password'
                                type={visible ? 'text' : 'password'}
                                onChange={handlePassword}
                                    value={password}
                                    fullWidth
                                // {...register("password", {
                                //     required: "Password must not be empty",
                                // })}
                            ></TextField>
                            <span
                                className={classes.visibilityIcon}
                                onClick={handleType}
                            >
                                {visible ?
                                    <VisibilityOffIcon /> :
                                    <VisibilityIcon />
                                }
                            </span>
                            {error &&
                                <p className={classes.errMessage}>
                                    {error}
                                </p>
                            }
                        </div>

                        {/* loginButton */}
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                            className={classes.loginBtn}
                            onClick={onSubmit}
                            >
                                Login
                            </Button>
                        </div>
                        {/* message */}
                        <div className={classes.toSignupMsg}>
                            <small>
                                <div>Don't have an account?</div>
                                <div>signup
                                    <Link to='/signup'> here</Link>
                                </div>
                            </small>
                        </div>
                        {/* </form> */}
                    </Grid>
                    <Grid item md sm={3} xs={2} />
                </Grid>
            </div>
        ); 
    } else {
        return <Loading text='Logging in...' />
    }
}


export default Login

