import React from 'react';
import FlightItem from './components/FlightItem';
import {Resolver} from 'react-resolver';
import cx from 'classnames';

require('./styles.css');

class Flights extends React.Component {

  constructor(props: object) : void {
    super(props);
  }

  render() : React.DOM {
    var fee = this.context.router.getCurrentParams().fee,
        holderClass = cx('Flights', {
          'is-populated': !!this.props.flights.length
        }), flights;

    /*
     * make a flight item for each flight returned by the server
     */
    flights = this.props.flights.map(function(flight) {
      return (
        <FlightItem {...flight} key={flight.airport}/>
      );
    });

    /*
     * if the proposed fee is less than 100, deny!
     */
    if (fee.length < 3) {
      flights = [];
    }

    return (
      <div className={holderClass}>
        {flights}
      </div>
    );
  }
}

Flights.contextTypes = {
  router: React.PropTypes.func.isRequired
};

Flights.propTypes = {
  flights: React.PropTypes.array.isRequired
};

Flights.defaultProps = {
  flights: []
};

Flights.displayName = 'Flights';

export default Resolver.createContainer(Flights, {

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  resolve: {
    flights(props: object, context: object) : void {
      const {fee} = context.router.getCurrentParams();

      if (fee.length < 3) {
        return [];
      } else {
        return fetch(`http://localhost:4000/api/flights/${fee}`, {headers: { 'Accept': 'application/json; charset=UTF-8' } }).
          then( (response) => response.json() ).
          then( (jsonResponse) => jsonResponse.flights ).
          catch( () => [{airport: 'error', fee: ''}] );
      }
    }
  }
});
