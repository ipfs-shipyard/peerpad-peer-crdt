import React, { Component } from 'react'
import { Flex, Box } from 'grid-styled'
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
        /*
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
        */
      ],
      sessionNetworkStart: false,
      addedSession: false,
      addedAttestation: false
    }

    this.recents = null

    const crdtipfs = PeerCRDTIPFS(this.props.ipfs)
    const writeKey = props.match.params.writeKey
    const readKey = props.match.params.readKey
    this.crypto = new Crypto(readKey, writeKey)

    this._crdt = PeerCRDT.defaults({
      ...crdtipfs,
      signAndEncrypt: this.crypto.encrypt.bind(this.crypto),
      decryptAndVerify: this.crypto.decrypt.bind(this.crypto)
    })

    this._crdt2 = PeerCRDT.defaults({
      ...crdtipfs,
      signAndEncrypt: async (input) => {
        return JSON.stringify(input)
      },
      decryptAndVerify: async (input) => {
        input = new TextDecoder('utf-8').decode(input)
        return JSON.parse(input)
      }
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
    if (this.props.attestation === null && nextProps.attestation !== null) {
      this.recents = this._crdt2.create(
        'lww-set',
        `${nextProps.attestation.user_id}-recents5`
      )
      this.recents.network.start().then(() => {
        const params = `${this.props.match.params.uuid}/${this.props.match.params.readKey}/${
          this.props.match.params.writeKey
        }`
        this.recents.add(params)
      })
    }
  }

  UNSAFE_componentWillUpdate(props, state) {
    if (props.sessionId !== null && state.sessionNetworkStart && !state.addedSession) {
      const sessions = this._sessions.value();
      this.setState({ addedSession: true })
      if (!sessions.hasOwnProperty(this.props.sessionId) || (props.attestation !== null && sessions[this.props.sessionId].attestation === null)) {
        this._sessions.set(this.props.sessionId, { attestation: props.attestation })
      }
      if (props.attestation !== null) {
        this.setState({ addedAttestation: true });
      }
    }
    if (props.attestation !== null && !this.state.addedAttestation) {
      this._sessions.set(this.props.sessionId, { attestation: props.attestation })
      this.setState({ addedAttestation: true });
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
    this._sessions = this._crdt2.create('lww-register', `${uuid}-sessions4`)
    this._sessions.on('change', () => {
      const out = []
      const sessions = this._sessions.value()
      for (const sessionId of sessions.keys()) {
        const session = sessions.get(sessionId)
        let peerObj = null
        for (const peer of this.state.peers) {
          if (peer.id === sessionId) {
            peerObj = peer
            break
          }
        }
        if (peerObj === null) {
          peerObj = {}
        }
        peerObj.id = sessionId
        if (session.hasOwnProperty('attestation') && session.attestation !== null) {
          peerObj.user_id = session.attestation.user_id
          peerObj.username = session.attestation.name
        } else {
          peerObj.user_id = null
          peerObj.username = '???'
        }
        peerObj.confirmed = peerObj.confirmed || false
        peerObj.avatar =
          'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&q=75'
        // TODO attempt to confirm if unconfirmed and we have enough info
        out.push(peerObj)
      }
      this.setState({ peers: out })
    })
    this._sessions.network.start().then(() => {
      this.setState({ sessionNetworkStart: true })
    })
    //this._meta = this._crdt2.create('lww-register', `${uuid}-meta`)
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
              innerRef={(c) => (this._textarea = c)}
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
