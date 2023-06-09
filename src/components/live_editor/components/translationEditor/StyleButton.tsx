import React from 'react';
import Tooltip from '../../../styled/StyledTooltip';

export default class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      const { onToggle, style } = this.props;
      onToggle(style);
    };
  }

  render() {
    const { active, label, customColor, hex, removeCustomColor } = this.props;
    let className = 'RichEditor-styleButton';
    if (active) {
      className += ' RichEditor-activeButton';
    }
    if (customColor) {
      return (
        <Tooltip
          interactive
          title={
            <>
              <p>User defined color: {hex}</p>
              <p>
                Click{' '}
                <button
                  type="button"
                  style={{ border: 'none', background: 'none' }}
                  onClick={() => removeCustomColor(label)}
                >
                  here
                </button>{' '}
                to delete it.
              </p>
            </>
          }
        >
          <span
            className={className}
            role="button"
            tabIndex="0"
            onMouseDown={this.onToggle}
          >
            {label}
            <span
              style={{
                height: '10px',
                width: '10px',
                background: hex,
                display: 'inline-block',
                marginLeft: '5px',
                marginBottom: '-1px',
                border: 'solid 1px #9a9a9a',
              }}
            />
          </span>
        </Tooltip>
      );
    }
    return (
      <span className={className} role="button" tabIndex="0" onMouseDown={this.onToggle}>
        {label}
      </span>
    );
  }
}
