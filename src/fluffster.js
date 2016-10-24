var utils = require('./utils');
var kefir = require('kefir');

function State(state, messages, streamB$)
{
    if (this instanceof State)
    {
        this.state = state.appState;

        this._streamA$ = kefir.pool();
        this._streamB$ = streamB$;

        this.component = state.component;

        this._combined$ = this._streamA$ && this._streamB$
            ? kefir.combine([this._streamA$, this._streamB$], function (a, b)
            {
                return utils.extendMany({}, a, b);
            })
            : false;

        this.listeners = [];

        if (messages) this.assignMessages(messages);

        this.onNext(function (state)
        {
            this._streamA$.plug(
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
        this.provide();

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
    return this._combined$ ? this._combined$ : this._streamA$;
};

State.prototype.combine = function (stream)
{
    this._streamA$.plug(kefir.combine([this.stream(), stream], function (a, b)
    {
        return utils.extendMany({}, a, b);
    }));
};

State.prototype.provide = function ()
{
    this.stream().onValue(function(state)
        {
            utils.each(this.component, function (component)
            {
                if (component.subscribe)
                    component.subscribe(state);

            }.bind(this));
        }.bind(this)
    );
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