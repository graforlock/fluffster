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

            each(state.component, function (Component, index)
            {
                ReactDOM.render(React.createElement(Component, appState), document.querySelector(state.id[index]));
            });
        });
    };
    return Fluffster;
}


module.exports = function() { return ReactDecorator(State) };