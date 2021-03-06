import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import OAEP from '../lib/oaep'
import { Toolbar, NavLink } from 'rebass'
import uuidv4 from 'uuid/v4'
import Login from './Login'

const getKey = async () => {
  return {
    uuid: uuidv4(),
    ...(await OAEP.genKey())
  }
}

class Header extends Component {
  createNew = async (e) => {
    e.preventDefault()
    const { privateKey, publicKey, uuid } = await getKey()
    this.props.history.push(`/editor/${uuid}/${privateKey}/${publicKey}`)
  }

  render() {
    return (
      <Toolbar>
        <NavLink is={Link} to="/">
          PeerPad
        </NavLink>
        <NavLink ml="auto" onClick={this.createNew}>
          Create Pad
        </NavLink>
        <Login
          peerId={this.props.peerId}
          handleAttestation={this.props.handleAttestation}
          handleSession={this.props.handleSession}
        />
      </Toolbar>
    )
  }
}

export default withRouter(Header)
