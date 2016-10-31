var React = require('react'),
    ReactDOM = require('react-dom');

var State = require('./../fluffster'),
    each = require('./../utils/index').each;

function renderLoop(components, id)
{
    return function(props)
    {
        each(components, function (Component, index)
        {
            ReactDOM.render(React.createElement(Component, props),
                document.querySelector(id[index]));
        });
    }
}

function ReactDecorator(Fluffster)
{
    /* @Override */
    Fluffster.prototype.provide = function (updatedProps)
    {
        if(!this.renderLoop)
        {
            this.renderLoop = renderLoop(this._component, this._id);
        }
        this.renderLoop(updatedProps);
    };

    return Fluffster;
}


module.exports = function() { return ReactDecorator(State) };