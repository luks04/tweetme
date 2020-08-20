import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {TweetsComponent, TweetsDetailComponent} from './tweets'
import * as serviceWorker from './serviceWorker';

const appEl = document.getElementById('root')
if(appEl){
  ReactDOM.render(<App />, appEl);
}

const tweetsEl = document.getElementById('tweetme')
if(tweetsEl){
  ReactDOM.render(React.createElement(TweetsComponent, tweetsEl.dataset), tweetsEl);
}

const tweetDetailElements = document.querySelectorAll(".tweetme-detail")
tweetDetailElements.forEach(container => {
  ReactDOM.render(React.createElement(TweetsDetailComponent, container.dataset), container);
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
