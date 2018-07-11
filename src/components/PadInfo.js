import React, { Component } from 'react'
import CopyRoom from './CopyRoom'
import Peers from './Peers'

class PadInfo extends Component {
  render() {
    const { readKey, writeKey, uuid, peers } = this.props
    return (
      <div>
        <Peers peers={peers} />
        <CopyRoom readKey={readKey} writeKey={writeKey} uuid={uuid} />
      </div>
    )
  }
}

export default PadInfo
