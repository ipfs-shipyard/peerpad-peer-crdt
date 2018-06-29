import React, { Component } from 'react';
import Editor from './Editor';

class App extends Component {
  render() {
    return (
      <div>
        <Editor crdtName={this.props.crdtName} />
      </div>
    );
  }
}

export default App;
