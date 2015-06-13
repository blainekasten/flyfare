/** @flow */

require('./styles.css');

import React from 'react';
import _ from 'lodash';

class FlightItem extends React.Component {
  constructor(props: ?object) : void {
    super(props);

    this.state = {
      triedToBuy: false
    };
  }

  render() : React.DOM {
    if (this.state.triedToBuy) {
      return this.renderMsg();
    }

    return (
      <div className='FlightItem' >
        <div className='FlightItem-airport'>{this.props.airport}</div>
        <div className='FlightItem-fee'>{this.props.fee}</div>
        <button className='FlightItem-buy' onClick={() => this.showMessage() }>Purchase Tickets!</button>
      </div>
    );
  }

  renderMsg() : React.DOM {
    return (
      <div className='FlightItem' >
        <p>Sorry, we do not have a way to sell flights yet.</p>
      </div>
    );
  }

  showMessage() : void {
    this.setState({triedToBuy: true}, function(){
      _.delay(
        () => this.setState({triedToBuy: false})
        , 2400
      );
    });
  }
}

FlightItem.propTypes = {
  airport: React.PropTypes.string.isRequired,
  fee: React.PropTypes.string.isRequired
};


export default FlightItem;
