var utils = require('./utils');
renderLoop = utils.renderLoop;

function State(setup, rootState)
{
    /*  0. Constructor check */

    if (this instanceof State)
    {
        /* 1. Inital setup */

        rootState = rootState || {};
        this._id = [];

        this.state = utils.extendMany({}, rootState, setup.appState);

        if (setup.component) this._component = setup.component;
        if (setup.id) this._id = setup.id;
        if (setup.messages) this.assignMessages(setup.messages);

        /* @Class method */
        this.onNext = function (id)
        {
            if (id && this._id.indexOf(id) === -1) this._id.push(id);

            if (this._component)
            {
                this.provide(this.state);
            }
        }.bind(this);

        /* @Class method */
        this.updateState = function (newState)
        {
            var comparator = utils.extendMany({}, this.state, newState);
            if (!utils.compareTo(this.state, comparator))
            {
                utils.extend(this.state, newState);
                this.onNext();
            }
        }.bind(this);

        /* 2. Initialise program. */

        /* @Initialisers */
        this.onNext();
    }
    else
    {
        /* Constructor check executed when no 'new'
         present in the call. */

        return new State(setup, rootState);
    }
}

State.prototype.provide = function (updatedState)
{
    /* Provides the state to all components. */

    if (!this.renderLoop)
    {
        this.renderLoop = renderLoop(this._component)
    }
    this.renderLoop(updatedState);

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

State.prototype.of = function (component)
{
    this._component = typeof component === 'object' ? component : [component];
    if (this._id.length)
    {
        this.onNext();
    }
    else
    {
        return {render: this.onNext.bind(this), component: component};
    }
};


module.exports = State;