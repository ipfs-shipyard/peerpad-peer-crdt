import React, { Component } from 'react'
import XIPFS from 'ipfs'
import PeerIdentity from 'peer-identity'
import Editor from './pages/Editor'
import Home from './pages/Home'
import Header from './components/Header'
import { Flex, Box } from 'grid-styled'
import { Provider } from 'rebass'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PeerCRDTIPFS from 'peer-crdt-ipfs'
import PeerCRDT from 'peer-crdt'

class App extends Component {
  constructor(props) {
    super(props)
    this.peerId = new PeerIdentity()
    this.ipfs = new XIPFS({
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
          ]
        },
        Bootstrap: []
      }
    })
  }

  render() {
    return (
      <Provider theme="crap">
        <Router>
          <Flex flexWrap="wrap">
            <Box width={1}>
              <Header peerId={this.peerId} />
            </Box>
            <Box px={2} width={1}>
              <Route
                exact
                path="/"
                ipfs={this.ipfs}
                peerId={this.peerId}
                render={(props) => <Home ipfs={this.ipfs} peerId={this.peerId} />}
              />
              <Route
                path="/editor/:uuid/:readKey/:writeKey"
                ipfs={this.ipfs}
                peerId={this.peerId}
                render={(props) => <Editor {...props} ipfs={this.ipfs} peerId={this.peerId} />}
              />
              <Route
                path="/readonly/:uuid/:readKey"
                ipfs={this.ipfs}
                peerId={this.peerId}
                render={(props) => <Editor {...props} ipfs={this.ipfs} peerId={this.peerId} />}
              />
            </Box>
          </Flex>
        </Router>
      </Provider>
    )
  }
}

export default App
