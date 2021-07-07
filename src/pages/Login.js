import React, { useState } from 'react'
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AppIcon from '../images/monkey-icon.png'
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

const useStyles = makeStyles((theme) => ({
    form: {
        textAlign: 'center',
    },
    image: {
        margin: '20px auto 20px auto',
        width: 70,
        height: 60,
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
        position: 'relative'
    },
    visibilityIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        cursor: 'pointer',
    },
}));

const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const isLoading = useSelector(state => state.users.isLoading);
    console.log(isLoading);
    

    // useState
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    // handlers
    const handleType = () => {
        setVisible(!visible)
    }

    // functions
    const onSubmit = async (data) => {
        dispatch(fetchLoginUserAsync(data));
        history.push('/');
    }

    if (!isLoading) {
        
        return (
            <div>
                <Grid container className={classes.form}>
                    <Grid item sm />
                    <Grid item sm>
                        <img className={classes.image} src={AppIcon} alt="monkey" />
                        <Typography
                            variant="h5"
                            className={classes.pageTitle}
                        >Login
                        </Typography>
    
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label="Email"
                                {...register('email', {
                                    required: 'Email must not empty',
                                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                })}
                            ></TextField>
                            {errors.email && <p className={classes.errMessage}>{errors.email.message}</p>}
                            <p className={classes.errMessage}>
                                {errors.email?.type === "pattern" && "Your Email address is invalid type"}
                            </p>
    
                            {/* password */}
                            <div className={classes.passwordArea}>
                                <TextField
                                    label="Password"
                                    {...register("password", {
                                        required: "Password must not be empty",
                                    })}
                                    type={visible ? 'text' : 'password'}
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
                                <p className={classes.errMessage}>
                                    {errors.password && errors.password.message}
                                </p>
                            </div>
    
                            {/* loginButton */}
                            <div>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.loginBtn}
                                    disabled={loading}
                                >
                                    Login
                                    {loading &&
                                        <CircularProgress className={classes.progress} />
                                    }
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
    
                        </form>
    
                    </Grid>
                    <Grid item sm />
                </Grid>
            </div>
        ); 
    } else {
        return <Loading text='Logging in...' />
    }
}


export default Login

