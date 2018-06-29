import React, { Component } from 'react';
import Editor from './Editor';
import Header from './Header';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Editor crdtName={this.props.crdtName} />
      </div>
    );
  }
}

export default App;
