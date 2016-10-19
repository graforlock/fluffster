var Resolve = require('./services/resolve');
var State = require('./fluffster');

var StateRouter = {

    store: null,
    routes: [],
    defaultErrorHandler: true,

    route: function (route)
    {
        StateRouter.routes.push(route);
    },

    render: function (route)
    {
        StateRouter.store = new State(route);
    },

    updateState: function (newState)
    {
        if (StateRouter.store) StateRouter.store.updateState(newState);
    },

    router: function (location)
    {
        Resolve(StateRouter.routes, location)
            .then(StateRouter.render)
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
    }
};

module.exports = StateRouter;
