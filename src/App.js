import React, { Component } from 'react'
import XIPFS from 'ipfs'
import PeerIdentity from 'peer-identity'
import Editor from './pages/Editor'
import Home from './pages/Home'
import Header from './components/Header'
import { Flex, Box } from 'grid-styled'
import { Provider } from 'rebass'
import { BrowserRouter as Router, Route } from 'react-router-dom'

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

    this.state = {
      attestation: null,
      sessionId: null
    }
  }

  handleAttestation(attestation) {
    this.setState({ attestation })
  }

  handleSession(sessionId) {
    this.setState({ sessionId })
  }

  render() {
    return (
      <Provider>
        <Router>
          <Flex flexWrap="wrap">
            <Box width={1}>
              <Header
                peerId={this.peerId}
                handleAttestation={this.handleAttestation.bind(this)}
                handleSession={this.handleSession.bind(this)}
              />
            </Box>
            <Box px={2} width={1}>
              <Route
                exact
                path="/"
                ipfs={this.ipfs}
                peerId={this.peerId}
                render={(props) => (
                  <Home
                    {...props}
                    ipfs={this.ipfs}
                    peerId={this.peerId}
                    attestation={this.state.attestation}
                  />
                )}
              />
              <Route
                path="/editor/:uuid/:readKey/:writeKey"
                ipfs={this.ipfs}
                peerId={this.peerId}
                render={(props) => (
                  <Editor
                    {...props}
                    ipfs={this.ipfs}
                    peerId={this.peerId}
                    sessionId={this.state.sessionId}
                    attestation={this.state.attestation}
                  />
                )}
              />
              <Route
                path="/readonly/:uuid/:readKey"
                ipfs={this.ipfs}
                peerId={this.peerId}
                sessionId={this.state.sessionId}
                render={(props) => (
                  <Editor {...props} ipfs={this.ipfs} peerId={this.peerId} />
                )}
              />
            </Box>
          </Flex>
        </Router>
      </Provider>
    )
  }
}

export default App
