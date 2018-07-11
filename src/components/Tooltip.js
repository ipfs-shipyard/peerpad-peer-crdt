import React, { Component } from 'react'
import { Overlay } from 'react-overlays'

const TooltipStyle = {
  position: 'absolute',
  padding: '0 5px'
}

const TooltipInnerStyle = {
  padding: '3px 8px',
  color: '#fff',
  textAlign: 'center',
  borderRadius: 3,
  backgroundColor: '#000',
  opacity: 0.75
}

const TooltipArrowStyle = {
  position: 'absolute',
  width: 0,
  height: 0,
  borderRightColor: 'transparent',
  borderLeftColor: 'transparent',
  borderTopColor: 'transparent',
  borderBottomColor: 'transparent',
  borderStyle: 'solid',
  opacity: 0.75
}

const PlacementStyles = {
  left: {
    tooltip: { marginLeft: -3, padding: '0 5px' },
    arrow: {
      right: 0,
      marginTop: -5,
      borderWidth: '5px 0 5px 5px',
      borderLeftColor: '#000'
    }
  },
  right: {
    tooltip: { marginRight: 3, padding: '0 5px' },
    arrow: {
      left: 0,
      marginTop: -5,
      borderWidth: '5px 5px 5px 0',
      borderRightColor: '#000'
    }
  },
  top: {
    tooltip: { marginTop: -3, padding: '5px 0' },
    arrow: {
      bottom: 0,
      marginLeft: -5,
      borderWidth: '5px 5px 0',
      borderTopColor: '#000'
    }
  },
  bottom: {
    tooltip: { marginBottom: 3, padding: '5px 0' },
    arrow: {
      top: 0,
      marginLeft: -5,
      borderWidth: '0 5px 5px',
      borderBottomColor: '#000'
    }
  }
}

const ToolTip = (props) => {
  let placementStyle = PlacementStyles[props.placement]

  let {
    style,
    arrowOffsetLeft: left = placementStyle.arrow.left,
    arrowOffsetTop: top = placementStyle.arrow.top,
    children
  } = props

  return (
    <div style={{ ...TooltipStyle, ...placementStyle.tooltip, ...style }}>
      <div
        style={{ ...TooltipArrowStyle, ...placementStyle.arrow, left, top }}
      />
      <div style={TooltipInnerStyle}>{children}</div>
    </div>
  )
}

class PadInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false
    }
  }

  toggle = () => {
    this.setState(({ show }) => ({ show: !show }))
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <div
          ref={(c) => (this._target = c)}
          onClick={this.toggle}
          onKeyDown={this.toggle}
          role="button"
          tabIndex={0}
        >
          {this.props.target}
        </div>

        <Overlay
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          container={this}
          target={() => this._target}
          {...this.props.overlay}
        >
          <ToolTip>{this.props.children}</ToolTip>
        </Overlay>
      </div>
    )
  }
}

export default PadInfo
