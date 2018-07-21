import React from 'react'
import { NavLink } from 'rebass'
import { API_URL, APP_URL } from '../lib/config'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      keyGenerated: false,
      keyLoaded: false,
      nameSet: false,
      attestSent: window.localStorage.getItem('attestSent') || false,
      attestReceived: false,
      did: {},
      userInfo: null,
      url: null,
      name: null,
      attestation: null,
      serverKeyReceived: false,
      checkSelfAttestation: false,
      selfVerified: false
    }
    this.props.peerId.handleState(this.handlePIState.bind(this))
    ;(async () => {
      await this.props.peerId.loadOrCreate()
      const res = await fetch(`${API_URL}/jwk`)
      const jwk = await res.json()
      await this.props.peerId.setPeer('server', jwk)
      this.setState({ serverKeyReceived: true })
    })()
    ;(async () => {
      if (this.state.attestSent && !this.attestReceived) {
        //TODO put tries around this
        const res2 = await fetch(
          `${API_URL}/proof2/${this.props.peerId.session.id}`
        )
        const attestation = await res2.json()
        const res = await fetch(`${API_URL}/user?id=${attestation.user_id}`)
        const userInfo = await res.json()
        attestation.name = userInfo.name
        attestation.email = userInfo.email
        this.setState({ attestation, userInfo })
        //critical, yo
        this.props.handleAttestation(attestation)
      }
    })()
  }

  UNSAFE_componentWillUpdate(props, state) {
    if (
      !state.selfVerified &&
      !state.checkSelfAttestation &&
      state.serverKeyReceived &&
      state.attestation !== null
    ) {
      this.props.peerId
        .verify(state.attestation.proof, 'server', state.attestation.signature)
        .then((validated) => {
          this.setState({ selfVerified: validated.verified })
          this.setState({ checkSelfAttestation: true })
        })
    }
  }

  handlePIState(state, value) {
    if (state === 'loadedKeyPair') {
      this.setState({ keyLoaded: value })
    } else if (state === 'generatedKeyPair') {
      this.setState({ keyGenerated: value })
    }
    this.props.handleSession(this.props.peerId.session.id)
  }

  async handleAttest() {
    const { proof, did } = await this.props.peerId.exportProof()
    this.setState({ url: `${API_URL}/pltest@test.com/${did.id}` })
    window.localStorage.setItem('attestSent', true)
    window.location = `${API_URL}/sign2?proof=${proof}&next=${encodeURI(
      APP_URL
    )}`
  }

  render() {
    if (this.state.attestSent && this.state.selfVerified) {
      return <NavLink>{this.state.userInfo.name}</NavLink>
    } else {
      return <NavLink onClick={this.handleAttest.bind(this)}>Login</NavLink>
    }
  }
}

export default Login
