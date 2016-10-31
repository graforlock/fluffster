var Resolve = require('./services/resolve');
var State = require('./fluffster');
var ServiceProvider = require('./service-provider');
var history = require('./services/history');
var drivers = require('./drivers');
var utils = require('./utils');

var StateRouter = {

    appState: null,
    sharedState: null,
    routes: [],
    defaultErrorHandler: true,

    onError: function () {},

    updateState: function(updatedState)
    {
        StateRouter.sharedState = utils.extendMany({}, StateRouter.appState.state, updatedState);
        StateRouter.appState.updateState(StateRouter.sharedState);
    },

    handleErrorRoute: function ()
    {
        StateRouter.defaultErrorHandler = false;
    },

    route: function (route)
    {
        StateRouter.routes.push(route);
        return {
            onError: function (callback)
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
        if (type in drivers)
        {
            State = drivers[type]();
        }
    },

    render: function (route)
    {

        if (StateRouter.rootState)
        {
            StateRouter.appState = new State(route, StateRouter.rootState);
        }
        else
        {
            StateRouter.appState = new State(route, null);
        }

        if (route.provider)
        {
            ServiceProvider.getInstance(route.provider(route.appState))
                .then(function(response)
                {
                    StateRouter.appState
                        .updateState({ response: response });
                });
        }
    },
    send: function (message, newState)
    {
        if (StateRouter.appState.messages)
        {
            StateRouter.appState.passMessage(message, newState);
        }
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
                if (StateRouter.onError)
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
        if(!config.pathname) throw new Error("Router.link() : pathname is Required.");

        history.push(config);
    },

    listen: function ()
    {
        StateRouter.router(history.location);
        history.listen(StateRouter.router);
    },

    getRootState: function ()
    {
        return StateRouter.rootState;
    }

};

module.exports = StateRouter;
