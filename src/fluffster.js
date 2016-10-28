var utils = require('./utils');
var kefir = require('kefir');

function State(setup, propertyKeepAlive$)
{
    /*  0. Constructor check */

    if (this instanceof State)
    {
        /* 1. Inital setup */

        this.state = setup.appState;
        this._localStream$ = kefir.pool();
        this._propertyKeepAlive$ = propertyKeepAlive$;
        this._component = setup.component;
        this.listeners = [];
        if (setup.id) this._id = setup.id;
        if (setup.messages) this.assignMessages(setup.messages);

        /* 2. If there's two streams,
           stream merge occurs. */

        /* @Computed property */
        this._combinedStream$$ = this._localStream$ && this._propertyKeepAlive$
            ? kefir.combine([this._localStream$, this._propertyKeepAlive$], function (a, b)
            {
                return utils.extendMany({}, {appState: a}, {global: b});
            })
            : false;

        /* @Class method */
        this.onNext = function (state)
        {
            this._localStream$.plug(utils.emit(state));
        }.bind(this);

        /* @Class method */
        this.updateState = function (newState)
        {
            var comparator = utils.extendMany({}, this.state, newState);
            if (!utils.compareTo(this.state, comparator))
            {
                utils.extend(this.state, newState);
                this.onNext(this.state);
            }
        }.bind(this);

        /* 3. Initialise program. */

        /* @Initialisers */
        this.onNext(this.state);
        this.provide();
    }
    else
    {
        /* Constructor check executed when no 'new'
           present in the call. */

        return new State(setup, propertyKeepAlive$);
    }
}


State.prototype.stream = function ()
{
    /* Returns a stream or combined streams. */

    return this._combinedStream$$ ? this._combinedStream$$ : this._localStream$;
};


State.prototype.provide = function ()
{
    /* Provides the state to all components. */

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
    /* Passes a messages if a message interface
       exists in the current context. */

    if (message in this.messages)
    {
        this.updateState(this.messages[message](this.state, payload));
    }
};


State.prototype.assignMessages = function (messages)
{
    /* Messages list setter. */

    this.messages = messages;
};


module.exports = State;