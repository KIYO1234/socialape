import React, { useState, useCallback } from 'react'
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AppIcon from '../images/roundChat.jpeg'
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory, Link } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { fetchLoginUserAsync } from '../features/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../components';


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
    const isLoading = useSelector(state => state.users.isLoading);
    const isLoggedIn = useSelector(state => state.users.isLoggedIn)
    const error = useSelector(state => state.users.error);
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleEmail = useCallback((event) => {
        setEmail(event.target.value);
    }, [setEmail]);
    const handlePassword = useCallback((event) => {
        setPassword(event.target.value);
    }, [setPassword]);

    const handleType = () => {
        setVisible(!visible)
    };

    const onSubmit = async () => {
        dispatch(fetchLoginUserAsync({ email: email, password: password }))
    }

    console.log('isLoggedIn: ', isLoggedIn);
    if (isLoggedIn) {
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

                        <div className={classes.textFieldContainer}>
                            <TextField
                                label="Email"
                                autoComplete='email'
                                onChange={handleEmail}
                                value={email}
                                    type='search'
                                    fullWidth
                            ></TextField>
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

