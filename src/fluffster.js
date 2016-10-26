var utils = require('./utils');
var kefir = require('kefir');

function State(setup, propertyKeepAlive$)
{
    if (this instanceof State)
    {
        this.state =  setup.appState;

        this._localStream$ = kefir.pool();
        this._propertyKeepAlive$ = propertyKeepAlive$;

        this._component = setup.component;

        this._combinedStream$$ = this._localStream$ && this._propertyKeepAlive$
            ? kefir.combine([this._localStream$, this._propertyKeepAlive$], function (a, b)
            {
                return utils.extendMany({}, {appState: a}, {global: b});
            })
            : false;

        this.listeners = [];

        if (setup.messages) this.assignMessages(setup.messages);

        this.onNext = function (state)
        {
            this._localStream$.plug(utils.emit(state));
        }.bind(this);

        this.updateState = function (newState)
        {
            var comparator = utils.extendMany({}, this.state, newState);
            if (!utils.compareTo(this.state, comparator))
            {
                utils.extend(this.state, newState);
                this.onNext(this.state);
            }
        }.bind(this);

        this.onNext(this.state);
        this.provide();
    }
    else
    {
        return new State(state);
    }
}

State.prototype.stream = function ()
{
    return this._combinedStream$$ ? this._combinedStream$$ : this._localStream$;
};

State.prototype.provide = function ()
{
    this.stream().onValue(function (state)
        {
            utils.each(this._component, function (component)
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