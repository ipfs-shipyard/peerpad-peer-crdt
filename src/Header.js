import React, { Component } from 'react';
import { Flex, Box } from 'grid-styled'

class Header extends Component {
  render() {
    return (
      <Flex flexWrap='wrap' alignItems='center'>
        <Box width={[1, 2/3, null, 1/2 ]}>
          PeerPad
        </Box>
        <Box
          ml='auto'
          width={160}
          flex='none'
        >
          <button>+</button>
        </Box>
      </Flex>
    );
  }
}

export default Header;
