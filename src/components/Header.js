import React, { Component } from 'react';
import { Flex, Box } from 'grid-styled';
import { withRouter, Link } from 'react-router-dom';
import OAEP from '../oaep';

const getKey = async () => {

  const pair = await OAEP.genKey();
  return `${pair.privateKey}.${pair.publicKey}`;
};

class Header extends Component {
  createNew = async (e) => {
    e.preventDefault()
    const key = await getKey()
    this.props.history.push(`/editor/${key}`)
  }

  render() {
    return (
      <Flex flexWrap='wrap' alignItems='center' p={4}>
        <Box>
          <Link to='/'>PeerPad</Link>
        </Box>
        <Box
          ml='auto'
          flex='none'
        >
          <button onClick={this.createNew}>+</button>
        </Box>
      </Flex>
    );
  }
}

export default withRouter(Header);
