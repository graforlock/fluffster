var React = require('react'),
    ReactDOM = require('react-dom');

var State = require('./../fluffster'),
    each = require('./../utils/index').each;

function ReactDecorator(Fluffster)
{
    /* @Override */
    Fluffster.prototype.provide = function (state)
    {
        this.stream().onValue(function (appState)
        {
            /* Reactive Stream redraws component in a stateless
             fashion with new components. */

            each(this._component, function (Component, index)
            {
                ReactDOM.render(React.createElement(Component, appState), document.querySelector(this._id[index]));
            }.bind(this));
        }.bind(this));
    };
    return Fluffster;
}


module.exports = function() { return ReactDecorator(State) };