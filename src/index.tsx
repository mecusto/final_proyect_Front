import React from 'react';
import ReactDOM from 'react-dom';

import App from './Components/App/App';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Provider } from 'react-redux';
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import reducers from "./Redux/Reducers/index";
import { Router } from 'react-router-dom';
import history from './utils/history';

const store = createStore(reducers, composeWithDevTools());

ReactDOM.render(
  
  <Provider store={store} >
    <Router history={history}>
    <App />
    </Router>
  </Provider>,
document.getElementById('root'));



