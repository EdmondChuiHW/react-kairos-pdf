import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import CircularProgress from "@material-ui/core/es/CircularProgress";

ReactDOM.render(
  <Suspense fallback={<CircularProgress/>}>
    <App/>
  </Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
