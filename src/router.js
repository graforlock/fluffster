var Resolve = require('./services/resolve');
var State = require('./fluffster');
var history = require('./services/history');
var drivers = require('./drivers');
var kefir = require('kefir');

var StateRouter = {

    disposableStream$: null,
    mainStream$: null,
    property$: null,
    onError: function() {},

    routes: [],
    defaultErrorHandler: true,

    handleErrorRoute: function()
    {
        StateRouter.defaultErrorHandler = false;
    },

    route: function (route)
    {
        StateRouter.routes.push(route);
        return {
            onError: function(callback)
            {
                /* Reason:
                   You may want to have one route that is not to be SPA route
                   an yet you have some JS loaders or components mounts. */

                StateRouter.onError = callback;
            }
        }
    },
    driver: function (type)
    {
        if(type in drivers)
        {
            State = drivers[type]();
        }
    },
    global: function (state)
    {
        StateRouter.mainStream$ = kefir.pool();
        StateRouter.property$ = StateRouter.mainStream$.toProperty();
        StateRouter.mainStream$.plug(kefir.stream(function (emitter)
        {
            return emitter.emit(state);
        }));
    },
    render: function (route)
    {
        if (StateRouter.mainStream$)
        {
            StateRouter.disposableStream$ = new State(route, StateRouter.property$);
            return;
        }

        StateRouter.disposableStream$ = new State(route, null);
    },
    send: function (message, newState)
    {
        if (StateRouter.disposableStream$.messages)
            StateRouter.disposableStream$.passMessage(message, newState);
    },
    router: function (location)
    {
        Resolve(StateRouter.routes, location)
            .then(function (route)
            {
                return StateRouter.render(route);
            })
            .catch(function (error)
            {
                if(StateRouter.onError)
                {
                    /* Custom error handler */
                    StateRouter.onError(error);
                }
                else
                {
                    /* Log error the error. */
                    console.warn(error);
                }

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
    },
    stream: function ()
    {
        return StateRouter.mainStream$;
    }
};

module.exports = StateRouter;
