import React, { Component } from 'react'
import { Border } from 'rebass'
import Showdown from 'showdown'

class Render extends Component {
  constructor(props) {
    super(props)
    this._converter = new Showdown.Converter()
  }

  render() {
    const { children, ...rest } = this.props
    return (
      <Border {...rest}>
        <div
          dangerouslySetInnerHTML={{
            __html: this._converter.makeHtml(children)
          }}
        />
      </Border>
    )
  }
}

export default Render
