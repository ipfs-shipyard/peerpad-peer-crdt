import React, { Component } from 'react';
import './App.css';

const XIPFS = require('ipfs')
const PeerCRDT = require('peer-crdt')
const PeerCRDTIPFS = require('peer-crdt-ipfs')
const encrypt = require('peer-crdt/test/helpers/encrypt')
const decrypt = require('peer-crdt/test/helpers/decrypt')
const Showdown = require('showdown')
const TextareaBinding = require('peer-crdt-pad')

class App extends Component {
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
    window.crdt = crdt

    this._data = crdt.create('treedoc-text', props.crdtName)
    window.data = this._data

    this._converter = new Showdown.Converter()
  }

  componentDidMount() {
    this._data.network.start().then(() => {
      window.binding = new TextareaBinding(this._data, this._textarea)
      this.setMarkdown()
      setTimeout(this.setMarkdown, 500)
    })
  }

  setMarkdown = () => {
    this.setState({
      output: this._converter.makeHtml(this._textarea.value)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="input">
          <textarea ref={(c) => this._textarea = c} className="input-area" />
        </div>
        <div className="output" dangerouslySetInnerHTML={{ __html: this.state.output }} />
      </div>
    );
  }
}

export default App;
