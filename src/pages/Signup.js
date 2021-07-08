import React, { useState } from 'react'
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AppIcon from '../images/monkey-icon.png'
import Typography from "@material-ui/core/Typography";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Link } from 'react-router-dom';

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
        top: 20,
        cursor: 'pointer',
    },
    confirmPasswordArea: {
        position: 'relative'
    },
    visibilityOffIcon: {
        position: 'absolute',
        right: 0,
        top: 20,
        cursor: 'pointer',
    },
    hover: {
        opacity: '40%'
    },
}));

const Signup = () => {
    const classes = useStyles();
    const history = useHistory();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // useState
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState();
    const [visible, setVisible] = useState(false);
    const [confirm, setConfirm] = useState(false);

    // handler
    // password
    const handlePassword = (event) => {
        setPassword(event.target.value);
        // console.log(password);
    };
    const handleType = () => {
        setVisible(!visible)
    }
    // confirmPassword
    const handleConfirmType = () => {
        setConfirm(!confirm)
    }

    // console.log(errors);
    const onSubmit = async (data) => {
        // console.log(data);
        setLoading(true);
        await axios.post('/signup', data)
            .then(res => {
                // console.log(res.data);
                alert('You have signed up successfully!');
                setLoading(false);
                // tokenをlocalStorageに保存
                localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
                history.push('/');
            })
            .catch(err => {
                alert('Something went wrong... \n Try again !');
                console.log(err);
                setLoading(false);
            });
    };
    // localStorage.removeItem('Bearer');
    console.log(localStorage);

    return (
        <div>
            <Grid container className={classes.form}>
                <Grid item sm />
                <Grid item sm>
                    <img className={classes.image} src={AppIcon} alt="monkey" />
                    <Typography
                        variant="h5"
                        className={classes.pageTitle}
                    >Signup
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label="Email"
                            {...register('email', {
                                required: 'Email must not empty',
                                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                            })}
                            fullWidth
                        ></TextField>
                        {errors.email &&
                            <p className={classes.errMessage}>{errors.email.message}
                                {errors.email?.type === "pattern" && "Your Email address is invalid type"}
                            </p>
                        }

                        {/* Password */}
                        <div className={classes.passwordArea}>
                            <TextField
                                label="Password"
                                {...register("password", {
                                    required: "Password must not be empty",
                                })}
                                onChange={handlePassword}
                                fullWidth
                                type={visible ? 'text' : 'password'}
                            ></TextField>
                            <span
                                className={classes.visibilityIcon}
                            >
                                {visible ?
                                    <VisibilityOffIcon
                                        onClick={handleType}
                                    /> :
                                    <VisibilityIcon
                                        onClick={handleType}
                                    />
                                }
                            </span>
                            {errors.password && <p className={classes.errMessage}>{errors.password.message}</p>}
                        </div>

                        {/* confirmPassword */}
                        <div className={classes.confirmPasswordArea}>
                            <TextField
                                label="Confirm Password"
                                {...register("confirmPassword", {
                                    required: "Password must not be empty",
                                    validate: (value => value === password)
                                })}
                                fullWidth
                                type={confirm ? 'text' : 'password'}
                            ></TextField>
                            <span
                                className={classes.visibilityOffIcon}
                            >
                                {confirm ?
                                    <VisibilityOffIcon
                                        onClick={handleConfirmType}
                                    /> :
                                    <VisibilityIcon
                                        onClick={handleConfirmType}
                                    />
                                }
                            </span>
                        </div>
                        {errors.confirmPassword &&
                            <p className={classes.errMessage}>
                                {errors.confirmPassword.message}
                                {errors.confirmPassword?.type === "validate" && "Password didn't match..."}
                            </p>
                        }

                        <TextField
                            label="Handle"
                            {...register("handle", {
                                required: "Handle must not be empty",
                            })}
                            fullWidth
                        ></TextField>
                        {errors.handle && <p className={classes.errMessage}>{errors.handle.message}</p>}

                        <div>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.loginBtn}
                                disabled={loading}
                            >
                                Signup
                                {loading &&
                                    <CircularProgress className={classes.progress} />
                                }
                            </Button>
                        </div>

                        {/* message */}
                        <div className={classes.toSignupMsg}>
                            <small>
                                <div>Already have an account?</div>
                                <div>login
                                    <Link to='/login'> here</Link>
                                </div>
                            </small>
                        </div>

                    </form>

                </Grid>
                <Grid item sm />
            </Grid>
        </div>
    );
}


export default Signup

