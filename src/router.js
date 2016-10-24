var Resolve = require('./services/resolve');
var State = require('./fluffster');
var history = require('./services/history');
var drivers = require('./drivers');
var kefir = require('kefir');

var StateRouter = {

    store: null,
    globalState: null,
    routes: [],
    defaultErrorHandler: true,

    route: function (route)
    {
        StateRouter.routes.push(route);
    },

    driver: function (type)
    {
        State = drivers[type]();
    },

    global: function (state)
    {
        StateRouter.globalState = kefir.pool();
        StateRouter.property = StateRouter.globalState.toProperty();
        StateRouter.globalState.plug(kefir.stream(function (emitter)
        {
            return emitter.emit(state)
        }));
    },

    render: function (route)
    {
        if (StateRouter.globalState)
        {
            StateRouter.store = new State(route, route.messages, StateRouter.property);
            return;
        }

        StateRouter.store = new State(route, route.messages, null);
    },

    sendMessage: function (message, newState)
    {
        if (StateRouter.store.messages)
            StateRouter.store.passMessage(message, newState);
    },

    router: function (location)
    {
        Resolve(StateRouter.routes, location)
            .then(function(route)
            {
                return StateRouter.render(route);
            })
            .catch(function (error)
            {
                /* Log error at all times. */
                console.warn(error);

                if (!StateRouter.defaultErrorHandler)
                {
                    /* Static defaultErrorHandler = true;
                     This results in default executing fallback of
                     handling the missing route, so the code below
                     would not be executed. */

                    Resolve(StateRouter.routes, {location: location, error: error})
                        .then(StateRouter.render);
                }
            });
    },

    link: function (config)
    {
        history.push(config);
    },

    listen: function ()
    {
        StateRouter.router(history.location);
        history.listen(StateRouter.router);
    }
};


module.exports = StateRouter;
