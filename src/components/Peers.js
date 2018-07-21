import React, { Component } from 'react'
import { Avatar } from 'rebass'
import { Flex, Box } from 'grid-styled'
import Tooltip from './Tooltip'

class Peers extends Component {
  render() {
    const { peers } = this.props
    return (
      <Flex>
        {peers.map((peer) => (
          <Box key={peer.id} ml={2}>
            <Tooltip
              overlay={{
                placement: 'bottom'
              }}
              target={
                <Avatar
                  size={32}
                  src={peer.avatar}
                  style={{ display: 'block' }}
                />
              }
            >
              {peer.username}
              {!peer.confirmed && ' (unconfirmed)'}
            </Tooltip>
          </Box>
        ))}
      </Flex>
    )
  }
}

export default Peers
