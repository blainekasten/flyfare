import http from 'https';
import moment from 'moment';
import _ from 'lodash';
import Promise from 'promise';

const AIRPORT_CODES = [
  'ATL', 'MSP', 'CLT', 'BOS', 'MDW', 'ORD', 'CVG', 'CLE', 'DEN', 'RSW', 'LAS', 'LAX', 'HOU', 'MEM', 'MIA', 'JK', 'PHL', 'PIT'
];

/*
 * post data for google api
 *
 * @params {number, string} fee
 * @params {string} instance of AIRPORT_CODES
 *
 * @returns Object
 */
function generatePostData(fee, destinationCode) {
  return {
    request: {
      slice: [
        {
          origin: 'LNK', // could geolocate in the future
          destination: destinationCode,
          date: moment().add(1, 'days').format('YYYY-MM-DD')
        }
      ],
      passengers: {
        adultCount: 1,
        infantInLapCount: 0,
        infantInSeatCount: 0,
        childCount: 0,
        seniorCount: 0
      },
      maxPrice: `USD${fee}.00`,
      refundable: false,
      solutions: 1
    }
  };
}


/*
 * makes a post request for fliht data
 * based on the fee and airport
 *
 *
 * @params {number, string} fee
 * @params {string} instance of AIRPORT_CODES
 *
 * @returns Promise
 */
function promiseRequest(fee, airportCode) {
  var postData = JSON.stringify(generatePostData(fee, airportCode)),
      options = {
        host: 'www.googleapis.com',
        path: '/qpxExpress/v1/trips/search?key=AIzaSyAo2Z3mKsjKjoM7w-SgQtIFWl7tofNwbF0',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': postData.length
        }
      };

  return new Promise(function(resolve, reject) {
    var chunks = '';
    var postRequest = http.request(options, function(_res) {
      _res.setEncoding('utf8');
      _res.on('data', (chunk) => chunks += chunk );
      _res.on('end', function(){
        var parsedChunks = JSON.parse(chunks);

        if (parsedChunks.trips) {
          parsedChunks.trips.airport = airportCode;
        }

        resolve(parsedChunks.trips);
      });
    });

    postRequest.write(postData);
    postRequest.end();
  });
}


/*
 * @exported
 *
 * Gets quotes for rates to different cities. Essentially we loop through different states we can land at
 * and map out rates that we get back from the google api
 *
 * @params {Object} req
 * @params {Object} res
 *
 * @returns json
 */
function getQuotes(req, res) {
  var fee = req.params.fee;

  /*
   * dont hit the api for this worthless request
   */
  if (fee.length < 3) {
    return res.json({flights: []});
  }

  /*
   * wait for all requests to finish then build the response
   */
  Promise.all(
    AIRPORT_CODES.map((code) => promiseRequest(fee, code))
  ).then( function(resps) {
    var flights = [];

    // loop through responses and build server response
    resps.forEach( function( response ) {
      var salePrice;

      if (!(typeof response === 'object' && response.airport)) { return; }

      // this may have issues with edge cases. I'm not sure, haven't experienced any yet
      if (Array.isArray(response.tripOption)) {
        salePrice = response.tripOption[0].pricing[0].saleTotal.replace('USD', '');
      }

      // we dont want to show things that we cant find
      if (!salePrice) {
        return;
      }

      flights.push({
        airport: response.airport,
        fee: salePrice
      });
    });

    // sort by price
    flights = _.sortBy(flights, 'fee');
    return res.json({flights});
  });
}



export default getQuotes;
