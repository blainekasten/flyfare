/*global jest:true, describe: true, it: true*/

jest.dontMock('../index.js');
var React = require('react');
var TestUtils = require('react/lib/ReactTestUtils');
var NumericInput = require('../index.js');

describe('NumericInput', function() {
  beforeEach(function() {
    // Render a NumericInput in the document
    this.NumericInputTest = TestUtils.renderIntoDocument(
      <NumericInput />
    );
  });

  it('should reject alpha characters', function(){
    this.NumericInputTest.setState({value: '123'});

    TestUtils.Simulate.change(this.NumericInputTest, {target: {value: '123a'}});

    expect(this.NumericInputTest.state.value).toEqual('123');
  });
});
