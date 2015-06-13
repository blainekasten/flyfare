/** @flow */
'use strict';

require('./styles.css');

import React from 'react';
import NumericInput from '../../components/NumericInput';
import {RouteHandler} from 'react-router';
import cx from 'classnames';
import _ from 'lodash';

class AppBase extends React.Component {

  constructor(props: object, context: ?object) : void {
    var params = context.router.getCurrentParams();

    super(props, context);

    this.state = {
      fee: params.fee || ''
    };
  }

  render() : React.DOM {
    var notShowingRates = this.state.fee.length < 3,
        infoDOM,
        headerClass = cx('AppBase-header', {
          'is-full-screen': notShowingRates
        });

    if (notShowingRates) {
      infoDOM = (
        <p className='AppBase-info'>Enter how much money you have to spend above, and we will find out what cities you could fly to tomorrow for that price!</p>
      );
    } else {
      infoDOM = (
        <div className='AppBase-info is-loading fa-spin'>
          <div className='fa fa-plane AppBase-info-plane'></div>
        </div>
      );
    }

    return (
      <div className='AppBase'>
        <div className={headerClass} >
          <div className='AppBase-header-logo'>
            <h1>FlyFare</h1>
          </div>

          <div className='AppBase-header-rate'>
            <NumericInput value={this.state.fee} onChange={(fee) => this.updateFee(fee) } />
            <h5>Name your rate!</h5>
          </div>

          {infoDOM}

        </div>

        <RouteHandler />
      </div>
    );
  }

  updateFee(fee: string) : void {
    this.setState({fee}, function(){
      _.debounce(this.updateRouter.bind(this), 600)();
    });

  }

  updateRouter() : void {
    this.context.router.transitionTo(
      'flights',
      {fee: this.state.fee}
    );
  }
}

AppBase.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default AppBase;

