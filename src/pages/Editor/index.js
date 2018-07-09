import React, { Component } from 'react';
import { Flex, Box } from 'grid-styled';
import XIPFS from 'ipfs';
import PeerCRDT from 'peer-crdt';
import PeerCRDTIPFS from 'peer-crdt-ipfs';
import Crypto from '../../lib/crypto';
import TextareaBinding from 'peer-crdt-pad';
import Render from '../../components/Render';
import PadInfo from '../../components/PadInfo';
import shallowEqual from '../../lib/simpleShallowEqual';
import OAEP from '../../lib/oaep';
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
    const writeKey = props.match.params.writeKey;
    const readKey = props.match.params.readKey;
    this.crypto = new Crypto(readKey, writeKey);

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

  componentWillReceiveProps(nextProps) {
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
    const { params }= this.props.match
    const { writeKey } = params
    return (
      <div>
        <Flex>
          <Box width={50} ml='auto'>
            <PadInfo {...params} />
          </Box>
        </Flex>
        <Flex className='Editor'>
          <Box flex='1 1 auto' p={2} style={{ display: writeKey ? 'block' : 'none' }}>
            <textarea
              ref={(c) => this._textarea = c}
              className="input-area"
            />
          </Box>
          <Box flex='1 1 auto' p={2}>
            <Render>
              {this.state.output}
            </Render>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default Editor;
