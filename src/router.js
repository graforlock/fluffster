import React from 'react';
import State from './fluffster';
import Resolve from './services/resolve';

/* @Singleton */
class StateRouter {

    static store = null;
    static routes = [];
    static defaultErrorHandler = true;

    static route(route)
    {
        StateRouter.routes.push(route);
    }

    static render(route)
    {
        StateRouter.store = new State(route);
    }

    static updateState(newState)
    {
        if (StateRouter.store) StateRouter.store.updateState(newState);
    }

    static router(location)
    {
        Resolve(StateRouter.routes, location)
            .then(StateRouter.render)
            .catch(error =>
            {
                /* Log error at all times. */
                console.warn(error);

                if (!StateRouter.defaultErrorHandler)
                {
                    /* Static defaultErrorHandler = true;

                     This results in default executing fallback of
                     handling the missing route, so the code below
                     would not be executed. */

                    Resolve(StateRouter.routes, {...location, error})
                        .then(StateRouter.render)
                }
            });
    }
}

export default StateRouter;