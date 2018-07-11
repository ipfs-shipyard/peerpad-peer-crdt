import React, { Component } from 'react';
import Tooltip from './Tooltip'

class CopyRoom extends Component {
  copy (input) {
    input.select()

    try {
      document.execCommand('copy')
      input.blur()
    } catch (err) {
      console.error('Failed to exec copy command', err)
      window.alert('Please press Ctrl/Cmd+C to copy')
    }
  }

  render(){
    const { readKey, writeKey, uuid } = this.props
    return (
      <Tooltip
        target={<button>URLs</button>}
        overlay={{
          placement: 'left'
        }}
      >
        <div style={{ width: 200 }}>
          {readKey &&
            <div>
              <label>Read only link</label>
              <input
                value={`${window.location.origin}/readonly/${uuid}/${readKey}`}
                readOnly
                ref={(c) => this._readKeyInput = c}
              />
              <button onClick={() => this.copy(this._readKeyInput)}>Copy</button>
            </div>
          }
          {writeKey &&
            <div>
              <label>Writeable link</label>
              <input
                value={`${window.location.origin}/editor/${uuid}/${readKey}/${writeKey}`}
                readOnly
                ref={(c) => this._writeKeyInput = c}
              />
              <button onClick={() => this.copy(this._writeKeyInput)}>Copy</button>
            </div>
          }
        </div>
      </Tooltip>
    );
  }
}

export default CopyRoom

