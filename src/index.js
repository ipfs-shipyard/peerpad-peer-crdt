import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App crdtName={window.location.hash.substr(1) || undefined} />, document.getElementById('root'));
registerServiceWorker();
