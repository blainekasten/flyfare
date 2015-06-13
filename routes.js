/** @flow */
import React from 'react';
import Router from 'react-router';

const {
  Route,
  NotFoundRoute,
} = Router;

import App from './handlers/Base';
import Flights from'./handlers/Flights';
import NotFound from './handlers/NotFound';

var routes = (
  <Route path="/" handler={App}>
    <Route name='flights' path="flights/:fee" handler={Flights} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

export default routes;

