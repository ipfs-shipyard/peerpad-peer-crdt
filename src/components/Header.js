import React, { Component } from 'react';
import { Flex, Box } from 'grid-styled';
import { withRouter, Link } from 'react-router-dom';
import OAEP from '../lib/oaep';
import uuidv4 from 'uuid/v4'

const getKey = async () => {

  return {
    uuid: uuidv4(),
    ...(await OAEP.genKey())
  }
};

class Header extends Component {
  createNew = async (e) => {
    e.preventDefault()
    const { privateKey, publicKey, uuid } = await getKey()
    this.props.history.push(`/editor/${uuid}/${privateKey}/${publicKey}`)
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
