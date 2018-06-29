import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const props = {}
const name = window.location.hash.substr(1)
if (name) props.crdtName = name

ReactDOM.render(<App {...props} />, document.getElementById('root'));
registerServiceWorker();
