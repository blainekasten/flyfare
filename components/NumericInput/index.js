/** @flow */

require('./styles.css');

import React from 'react';

const NUMERIC_REGEX = /^[0-9]+$/;

class NumericInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || ''
    };
  }

  render(): ?ReactElement {
    return (
      <input
        {...this.props}
        value={this.state.value}
        onChange={(e) => this.handleChange(e)}
        autoFocus={true}
      />
    );
  }

  handleChange(e: SyntheticEvent) : void {
    var value = e.target.value;

    /*
     * if they enter a non numeric, ignore
     */
    if (!NUMERIC_REGEX.test(value) && value.length !== 0) {
      return;
    }

    this.setState({value});

    this.props.onChange(value);
  }
}

export default NumericInput;
