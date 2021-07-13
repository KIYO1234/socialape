import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    loading: {
        textAlign: 'center',
        marginTop: '40%',
        fontSize: 40,
    },
    loadingMsg: {
        marginBottom: 15,
    }
}))

const Loading = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.loading}>
            <div className={classes.loadingMsg}>{props.text}</div>
            <CircularProgress></CircularProgress>
        </div>
    )
}

export default Loading