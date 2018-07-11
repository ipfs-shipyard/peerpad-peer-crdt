import React, { Component } from 'react'
import Tooltip from './Tooltip'

class CopyRoom extends Component {
  copy(input) {
    input.select()

    try {
      document.execCommand('copy')
      input.blur()
    } catch (err) {
      window.alert('Please press Ctrl/Cmd+C to copy')
    }
  }

  render() {
    const { readKey, writeKey, uuid } = this.props
    return (
      <Tooltip
        target={<button>URLs</button>}
        overlay={{
          placement: 'left'
        }}
      >
        <div style={{ width: 200 }}>
          {readKey && (
            <div>
              <label htmlFor="readKeyInput">
                Read only link{' '}
                <input
                  id="readKeyInput"
                  value={`${
                    window.location.origin
                  }/readonly/${uuid}/${readKey}`}
                  readOnly
                  ref={(c) => (this._readKeyInput = c)}
                />
              </label>

              <button onClick={() => this.copy(this._readKeyInput)}>
                Copy
              </button>
            </div>
          )}
          {writeKey && (
            <div>
              <label htmlFor="writeKeyInput">
                Writeable link
                <input
                  id="writeKeyInput"
                  value={`${
                    window.location.origin
                  }/editor/${uuid}/${readKey}/${writeKey}`}
                  readOnly
                  ref={(c) => (this._writeKeyInput = c)}
                />
              </label>
              <button onClick={() => this.copy(this._writeKeyInput)}>
                Copy
              </button>
            </div>
          )}
        </div>
      </Tooltip>
    )
  }
}

export default CopyRoom
