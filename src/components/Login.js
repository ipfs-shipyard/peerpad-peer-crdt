import React from 'react'

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
      const res = await fetch('http://localhost:8001/jwk')
      const jwk = await res.json()
      await this.props.peerId.setPeer('server', jwk)
      this.setState({ serverKeyReceived: true })
    })()
    ;(async () => {
      if (this.state.attestSent && !this.attestReceived) {
        const res = await fetch('http://localhost:8001/user')
        const userInfo = await res.json()
        this.setState({ userInfo })
        const res2 = await fetch(
          `http://localhost:8001/proof/${this.state.userInfo.id}/${
            this.props.peerId.session.id
          }`
        )
        const attestation = await res2.json()
        this.setState({ attestation })
      }
    })()
  }

  componentWillUpdate(props, state) {
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
  }

  async handleAttest() {

    const { proof, did } = await this.props.peerId.exportProof()
    this.setState({ url: `http://localhost:8001/pltest@test.com/${did.id}` })
    console.log('proof', proof)
    window.localStorage.setItem('attestSent', true)
    window.location = 'http://localhost:8001/sign2?proof=' + proof + '&next=' + encodeURI('http://localhost:3000')
  }

  render() {
    if (this.state.attestSent && this.state.selfVerified) {
      return <div>{this.state.userInfo.name}</div>;
    } else {
      return <div><button onClick={this.handleAttest.bind(this)}>Login</button></div>;
    }
  }
}

export default Login
