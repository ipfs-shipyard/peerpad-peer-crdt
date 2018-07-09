import React, { Component } from 'react';
import Editor from './pages/Editor';
import Home from './pages/Home';
import Header from './components/Header';
import { Flex, Box } from 'grid-styled'
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <Flex flexWrap="wrap">
          <Box px={2} width={1}>
            <Header />
          </Box>
          <Box px={2} width={1}>
            <Route exact path="/" component={Home} />
            <Route path="/editor/:key" component={Editor} />
          </Box>
        </Flex>
      </Router>
    );
  }
}

export default App;
