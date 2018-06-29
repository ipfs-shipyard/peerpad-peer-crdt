import React, { Component } from 'react'
import { Flex, Box } from 'grid-styled'
import XIPFS from 'ipfs'
import PeerCRDT from 'peer-crdt'
import PeerCRDTIPFS from 'peer-crdt-ipfs'
import encrypt from 'peer-crdt/test/helpers/encrypt'
import decrypt from 'peer-crdt/test/helpers/decrypt'
import Showdown from 'showdown'
import TextareaBinding from 'peer-crdt-pad'
import './Editor.css';

class Editor extends Component {
  static defaultProps = {
    crdtName: 'something5'
  }

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

    const crdt = PeerCRDT.defaults({
        ...crdtipfs,
        signAndEncrypt: encrypt,
        decryptAndVerify: decrypt
    })

    this._data = crdt.create('treedoc-text', props.crdtName)
    window.data = this._data

    this._converter = new Showdown.Converter()
  }

  componentDidMount() {
    this._data.network.start().then(() => {
      new TextareaBinding(this._data, this._textarea)
      this.setMarkdown()
      this._interval = setInterval(this.setMarkdown, 500)
    })
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  setMarkdown = () => {
    this.setState({
      output: this._converter.makeHtml(this._textarea.value)
    })
  }

  render() {
    return (
      <Flex className='Editor'>
        <Box flex='1 1 auto'>
          <textarea ref={(c) => this._textarea = c} className="input-area" />
        </Box>
        <Box flex='1 1 auto'>
          <div dangerouslySetInnerHTML={{ __html: this.state.output }} />
        </Box>
      </Flex>
    );
  }
}

export default Editor;
