import React, { Component } from 'react'
import { Flex, Box } from 'grid-styled'
import CopyRoom from './CopyRoom'
import Peers from './Peers'

class PadInfo extends Component {
  render() {
    const { readKey, writeKey, uuid, peers } = this.props
    return (
      <Flex>
        <Box>
          <Peers peers={peers} />
        </Box>
        <Box>
          <CopyRoom readKey={readKey} writeKey={writeKey} uuid={uuid} />
        </Box>
      </Flex>
    )
  }
}

export default PadInfo
