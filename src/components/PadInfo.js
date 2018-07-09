import React, { Component } from 'react';
import Tooltip from './Tooltip'

class PadInfo extends Component {
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
      <div>
        <Tooltip
          target='URLs'
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
      </div>
    );
  }
}

export default PadInfo

