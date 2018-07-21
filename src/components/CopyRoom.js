import React, { Component } from 'react'
import { Button, Input } from 'rebass'
import Tooltip from './Tooltip'
import { APP_URL } from '../lib/config'

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
        target={<Button ml={2}>URLs</Button>}
        overlay={{
          placement: 'bottom'
        }}
      >
        <div style={{ width: 200 }}>
          {readKey && (
            <div>
              <label htmlFor="readKeyInput">
                Read only link
                <Input
                  id="readKeyInput"
                  value={`${APP_URL}/readonly/${uuid}/${readKey}`}
                  readOnly
                  innerRef={(c) => (this._readKeyInput = c)}
                />
              </label>

              <Button
                style={{ display: 'block', width: '100%' }}
                onClick={() => this.copy(this._readKeyInput)}
              >
                Copy
              </Button>
            </div>
          )}
          {writeKey && (
            <div style={{ marginTop: 8 }}>
              <label htmlFor="writeKeyInput">
                Writeable link
                <Input
                  id="writeKeyInput"
                  value={`${APP_URL}/editor/${uuid}/${readKey}/${writeKey}`}
                  readOnly
                  innerRef={(c) => (this._writeKeyInput = c)}
                />
              </label>
              <Button
                style={{ display: 'block', width: '100%' }}
                onClick={() => this.copy(this._writeKeyInput)}
              >
                Copy
              </Button>
            </div>
          )}
        </div>
      </Tooltip>
    )
  }
}

export default CopyRoom
