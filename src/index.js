import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './app/store';
import firebase from 'firebase';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyA-rEhZ5KhnwNOhl2ImrbbK3ApxAmGU0f0",
  authDomain: "socialape-73b9a.firebaseapp.com",
  projectId: "socialape-73b9a",
  storageBucket: "socialape-73b9a.appspot.com",
  messagingSenderId: "737662390218",
  appId: "1:737662390218:web:6cf54ab09228ec409c0933",
  measurementId: "G-36NFY659CC"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
