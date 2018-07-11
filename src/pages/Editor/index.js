import React, { Component } from 'react'
import { Flex, Box } from 'grid-styled'
import XIPFS from 'ipfs'
import PeerCRDT from 'peer-crdt'
import { Input, Textarea, Container } from 'rebass'
import PeerCRDTIPFS from 'peer-crdt-ipfs'
import Crypto from '../../lib/crypto'
import TextareaBinding from 'peer-crdt-pad'
import Render from '../../components/Render'
import PadInfo from '../../components/PadInfo'
import shallowEqual from '../../lib/simpleShallowEqual'

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      output: '',
      peers: [
        {
          id: 1,
          avatar:
            'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&q=75',
          confirmed: true,
          username: 'Test'
        },
        {
          id: 2,
          avatar:
            'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=200&q=75',
          confirmed: false,
          username: 'Test2'
        }
      ]
    }

    const ipfs = new XIPFS({
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: ['/dns4/protocol.andyet.net/tcp/9090/ws/p2p-websocket-star']
        },
        Bootstrap: []
      }
    })

    const crdtipfs = PeerCRDTIPFS(ipfs)
    const writeKey = props.match.params.writeKey
    const readKey = props.match.params.readKey
    this.crypto = new Crypto(readKey, writeKey)

    this._crdt = PeerCRDT.defaults({
      ...crdtipfs,
      signAndEncrypt: this.crypto.encrypt.bind(this.crypto),
      decryptAndVerify: this.crypto.decrypt.bind(this.crypto)
    })

    this.start(props.match.params)
  }

  componentWillUnmount() {
    this.stop()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!shallowEqual(this.props.match.params, nextProps.match.params)) {
      this.start(nextProps.match.params)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.output === nextState.output) {
      return false
    }
    return true
  }

  start = ({ uuid }) => {
    this.stop()
    this._data = this._crdt.create('treedoc-text', uuid)
    window.data = this._data

    this._data.network.start().then(() => {
      this._binding = new TextareaBinding(this._data, this._textarea)
      this.setMarkdown()
      this._interval = setInterval(this.setMarkdown, 500)
    })
  }

  stop = () => {
    clearInterval(this._interval)
    if (this._binding) {
      this._binding.halt()
      this._textarea.value = ''
      this.setState({ output: '' })
    }
  }

  setMarkdown = () => {
    this.setState({
      output: this._textarea.value
    })
  }

  render() {
    const { params } = this.props.match
    const { writeKey } = params
    return (
      <Container>
        <Flex px={2} pt={4}>
          <Box flex="1 1 auto" mr={4}>
            <Input defaultValue="Pad Title" />
          </Box>
          <Box ml="auto">
            <PadInfo {...params} peers={this.state.peers} />
          </Box>
        </Flex>
        <Flex className="Editor">
          <Box
            flex="1 1 auto"
            p={2}
            style={{ display: writeKey ? 'block' : 'none' }}
          >
            <Textarea
              ref={(c) => (this._textarea = c)}
              style={{ height: '80vh' }}
            />
          </Box>
          <Box flex="1 1 auto" p={2}>
            <Render>{this.state.output}</Render>
          </Box>
        </Flex>
      </Container>
    )
  }
}

export default Editor
