import React, { Component } from 'react';
import { Flex, Box } from 'grid-styled'
import { withRouter } from 'react-router-dom'

const getKey = async () => new Promise((resolve) => {
  let text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  resolve(text)
})

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
          PeerPad
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
