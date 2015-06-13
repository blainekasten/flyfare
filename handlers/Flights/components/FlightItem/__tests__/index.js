/*global jest:true, describe: true, it: true*/

jest.dontMock('../index.js');
var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var FlightItem = require('../index.js');

describe('FlightItem', function() {
  beforeEach(function() {
    // Render a FlightItem in the document
    this.FlightItemTest = TestUtils.renderIntoDocument(
      <FlightItem airport='LAX' fee={'303'} />
    );
  });


  it('should render some text when you click buy', function(){
    var button = TestUtils.findRenderedDOMComponentWithTag(this.FlightItemTest, 'button');

    TestUtils.Simulate.click(button);

    var pTag = TestUtils.findRenderedDOMComponentWithTag(this.FlightItemTest, 'p');

    expect(pTag).toBeDefined();
  });
});
