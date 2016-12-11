var Resolve = require('./services/resolve');
var history = require('./services/history');
var utils = require('./utils');

var StateRouter = {

    routes: [],
    defaultErrorHandler: true,

    onError: utils.noop,

    handleErrorRoute: function ()
    {
        StateRouter.defaultErrorHandler = false;
    },

    route: function (route)
    {
        StateRouter.routes.push(route);
    },

    render: function (route)
    {
        utils.renderLoop(route.component, route.id)
            ({params: route.params});
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
    }

};

module.exports = StateRouter;
