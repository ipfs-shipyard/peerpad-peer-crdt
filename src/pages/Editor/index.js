import React, { Component } from 'react'
import { Flex, Box } from 'grid-styled'
import XIPFS from 'ipfs'
import PeerCRDT from 'peer-crdt'
import PeerCRDTIPFS from 'peer-crdt-ipfs'
import encrypt from 'peer-crdt/test/helpers/encrypt'
import decrypt from 'peer-crdt/test/helpers/decrypt'
import Showdown from 'showdown'
import TextareaBinding from 'peer-crdt-pad'
import './index.css';

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      output: ''
    }

    const ipfs = new XIPFS({
      EXPERIMENTAL: {
        pubsub: true
      }, config:  {
        Addresses: {
          Swarm: [
            '/dns4/protocol.andyet.net/tcp/9090/ws/p2p-websocket-star'
          ]
        },
        Bootstrap: []
      }
    })

    const crdtipfs = PeerCRDTIPFS(ipfs)

    this._crdt = PeerCRDT.defaults({
        ...crdtipfs,
        signAndEncrypt: encrypt,
        decryptAndVerify: decrypt
    })

    this.start({
      key: this.props.match.params.key
    })
  }

  componentWillUnmount() {
    this.stop()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.key !== nextProps.match.params.key) {
      this.start({
        key: nextProps.match.params.key,
        clear: true
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.output === nextState.output) {
      return false
    }
    return true
  }

  start = ({ key, clear }) => {
    this.stop({ clear })
    this._data = this._crdt.create('treedoc-text', key)
    window.data = this._data
    this._converter = new Showdown.Converter()

    this._data.network.start().then(() => {
      this._binding = new TextareaBinding(this._data, this._textarea)
      this.setMarkdown()
      this._interval = setInterval(this.setMarkdown, 500)
    })
  }

  stop = ({ clear = false } = {}) => {
    clearInterval(this._interval)
    if (this._textarea) this._textarea.value = ''
    if (clear) this.setState({ output: '' })
    if (this._binding) this._binding.halt()
  }

  setMarkdown = () => {
    console.log('set md', this._textarea.value)
    this.setState({
      output: this._textarea.value
    })
  }

  render() {
    console.log(this.state)
    return (
      <Flex className='Editor'>
        <Box flex='1 1 auto' p={2}>
          <textarea
            ref={(c) => this._textarea = c}
            className="input-area"
          />
        </Box>
        <Box flex='1 1 auto' p={2}>
          <div dangerouslySetInnerHTML={{
            __html: this._converter.makeHtml(this.state.output)
          }} />
        </Box>
      </Flex>
    );
  }
}

export default Editor;
