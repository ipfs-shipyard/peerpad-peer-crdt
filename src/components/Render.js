import React, { Component } from 'react'
import Showdown from 'showdown'

class Render extends Component {
  constructor(props) {
    super(props)
    this._converter = new Showdown.Converter()
  }

  render() {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: this._converter.makeHtml(this.props.children)
        }}
      />
    )
  }
}

export default Render
