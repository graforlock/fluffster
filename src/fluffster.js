var utils = require('./utils');
var kefir = require('kefir');

function State(state, messages)
{
    if (this instanceof State)
    {
        this.state = state.globalState
            ? utils.extendMany({}, state.appState, state.globalState)
            : state.appState;

        this._stream$ = kefir.pool();
        this.listeners = [];
        if (messages) this.assignMessages(messages);

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
                this.notify();
            }
        }.bind(this);

        this.notify();
        this.provide(state);

    }
    else
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

State.prototype.combine = function (stream)
{
    this._stream$.plug(kefir.combine([this.stream(), stream], function (a, b)
    {
        return utils.extendMany({}, a, b);
    }));

};

State.prototype.provide = function (state)
{
    utils.each(state.component, function (component)
    {
        if (component.subscribe)
            component.subscribe(this.stream());
    }.bind(this));
};

State.prototype.passMessage = function (message, payload)
{
    if (message in this.messages)
    {
        this.updateState(this.messages[message](this.state, payload));
    }
};

State.prototype.assignMessages = function (messages)
{
    this.messages = messages;
};

module.exports = State;