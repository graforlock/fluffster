var React = require('react'),
    ReactDOM = require('react-dom');

var State = require('./fluffster'),
    each = require('./utils').each;

function ReactDecorator(Fluffster)
{
    Fluffster.prototype.provide = function (state)
    {
        this.stream().onValue(function (appState)
        {
            /* Reactive Stream redraws component in a stateless
             fashion with new components. */

            each(state.component, function (Component, index)
            {
                ReactDOM.render(<Component {...appState} />, document.querySelector(state.id[index]));
            });
        });
    };
    return Fluffster;
}


module.exports = ReactDecorator(State);