var utils = require('./utils');
var kefir = require('kefir');

function State(state)
{
    if (this instanceof State)
    {
        this.state = state.appState;
        this._stream$ = kefir.pool();
        this.initState = state.appState;
        this.listeners = [];

        this.onNext(function (state)
        {
            this._stream$.plug(
                kefir.stream(function (emitter)
                {
                    return emitter.emit(state)
                }));
        }.bind(this));

        this.updateState = function (newState)
        {
            var comparator = utils.extendMany({}, this.state, newState);
            if (!utils.compareTo(this.state, comparator))
            {
                utils.extend(this.state, newState);
                this.notify(newState);
            }
        }.bind(this);

        this.notify();
        this.provide(state.component);

    } else
    {
        return new State(state);
    }
}

State.prototype.notify = function (newState)
{
    newState = newState || this.state;
    for (var i = 0; i < this.listeners.length; i++)
    {
        this.listeners[i](newState);
    }
};

State.prototype.onNext = function (next)
{
    this.listeners.push(next);
};

State.prototype.stream = function ()
{
    return this._stream$;
};

State.prototype.resetState = function ()
{
    this.updateState(this.initState);
};

State.prototype.provide = function (components)
{
    utils.each(components, function (component)
    {
        if(component.subscribe)
            component.subscribe(this.stream());
    }.bind(this));
};

module.exports = State;