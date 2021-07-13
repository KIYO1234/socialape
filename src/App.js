import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'; import { createTheme } from '@material-ui/core';
import jwtDecode from 'jwt-decode';
import AuthRoute from './util/AuthRoute';
// Pages
import { CommentDetails, Home, Login, Signup, User, EachScream } from './pages/index';
// Components
import { Navbar, ProfileSingle } from './components/index';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllCommentsAsync, fetchAllLikes, fetchScreamsAsync } from './features/screams/screamSlice';
import { useEffect } from 'react';
import { setUserAsync, logoutAsync } from './features/users/userSlice';

const theme = createTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff',
    },
  },
})


function App() {
  const dispatch = useDispatch();
  let authenticated = false;
  const token = localStorage.FBIdToken;
  // const screams = useSelector(state => state.screams.screams);
  // const handle = useSelector(state => state.users.loginUser.credentials.handle);
  // const likes = useSelector(state => state.screams.likes);
  // const likesByUser = likes.filter(like => like.userHandle === handle);
  // console.log('likesByUser: ', likesByUser);
  // const screams = useSelector(state => state.screams.screams);
  // console.log('screams', screams);
  // let isLikedByUser = []
  // for (let i = 0; i < screams.length; i++){
  //     isLikedByUser.push(likesByUser.findIndex(like => like.screamId === screams[i].screamId) !== -1)
  // }
  // console.log('isLikedByUser', isLikedByUser);
  

  if (token) {
    const decodedToken = jwtDecode(token)
    // console.log(decodedToken)
    // expireする時間と今の時間を比較
    // expireしていた場合の処理
    if (decodedToken.exp * 1000 < new Date()) {
      alert('Your account has been expired');
      // home に redirect する
      // こういう書き方もある
      // window.location.href = '/login';
      authenticated = false;
      // isLoggedIn = false;
      dispatch(logoutAsync());
      localStorage.removeItem('FBIdToken');
    }
  } else {
    // console.log('nothing')
    authenticated = false;
    // isLoggedIn = false;
    // dispatch(logoutAsync());
  }

  // console.log(localStorage.FBIdToken);

  useEffect(() => {
    console.log('App.js rendered');
    dispatch(fetchScreamsAsync());
    dispatch(fetchAllCommentsAsync());
    dispatch(fetchAllLikes());
    // axios.get('/screams')
  }, [dispatch]);
  useEffect(() => {
    if (token) {
      dispatch(setUserAsync());
    } else {
      dispatch(logoutAsync());
    }
  }, [dispatch, token]);

  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar></Navbar>
          <div className='container'>
            <Switch>
              <AuthRoute
                exact
                path='/signup'
                component={Signup}
                authenticated={authenticated}
              />
              <AuthRoute
                exact
                path='/login'
                component={Login}
                authenticated={authenticated}
              />
              <Route exact path='/profile' component={ProfileSingle} />
              <Route exact path='/comment/details/:screamId' component={CommentDetails} />
              <Route exact path='/users/:handle' component={User} />
              <Route exact path='/users/:handle/scream/:screamId' component={EachScream} />
              <Route exact path='/' component={Home} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
