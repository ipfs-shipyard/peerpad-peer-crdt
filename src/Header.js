import React, { Component } from 'react';
import { Flex, Box } from 'grid-styled'

class Header extends Component {
  render() {
    return (
      <Flex flexWrap='wrap' alignItems='center'>
        <Box>
          PeerPad
        </Box>
        <Box
          ml='auto'
          flex='none'
        >
          <button>+</button>
        </Box>
      </Flex>
    );
  }
}

export default Header;
