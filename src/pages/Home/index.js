import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Heading, Container, Border } from 'rebass'
import OAEP from '../../lib/oaep'
import uuidv4 from 'uuid/v4'
import PeerCRDTIPFS from 'peer-crdt-ipfs'
import PeerCRDT from 'peer-crdt'

const testDocuments = async (count) => {
  const res = []

  // eslint-disable-next-line no-unused-vars
  for (const doc of [...Array(count)]) {
    res.push({
      uuid: uuidv4(),
      ...(await OAEP.genKey())
    })
  }

  return res
}

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      documents: [],
      startRecents: false
    }
    this.crdtipfs = PeerCRDTIPFS(this.props.ipfs)
    this._crdt = PeerCRDT.defaults({
      ...this.crdtipfs,
      signAndEncrypt: async (input) => {
        return JSON.stringify(input)
      },
      decryptAndVerify: async (input) => {
        input = new TextDecoder('utf-8').decode(input)
        return JSON.parse(input)
      }
    })
    this.recents = null
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    this.start(props, state)
  }

  componentDidMount() {
    this.start(this.props, this.state)
  }

  start = (props, state) => {
    if (props.attestation !== null && !state.startRecents) {
      this.setState({ startRecents: true })
      this.recents = this._crdt.create(
        'lww-set',
        `${props.attestation.user_id}-recents5`
      )
      this.recents.on('change', () => {
        const docs = []
        const setRecents = this.recents.value()
        for (let dstring of setRecents) {
          const [uuid, privateKey, publicKey] = dstring.split('/')
          docs.push({ uuid, privateKey, publicKey })
        }
        this.setState({ documents: docs })
      })
      this.recents.network.start()
    }
  }

  render() {
    return (
      <Container mt={4}>
        <Heading>Recent Pads</Heading>
        {this.state.documents.map((d) => (
          <Border key={d.uuid} p={2} mt={2}>
            <Link to={`/editor/${d.uuid}/${d.privateKey}/${d.publicKey}`}>
              {d.uuid}
            </Link>
          </Border>
        ))}
      </Container>
    )
  }
}

export default Home
