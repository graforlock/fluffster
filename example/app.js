var fluffster = require('../dist'),
    router = fluffster.router,
    utils = fluffster.utils,
    Component = require('./component').react,
    CONSTANTS = Component.CONSTANTS;

var ajax = utils.ajax;

router.route(
    {
        "/": {
            component: [Component.A],
            id: ["#app"]
        }
    });

router.route(
    {
        "/test": {
            component: [Component.B],
            id: ["#app"]
        }
    });

router.route(
    {
        "/another/:id": {
            component: [Component.C],
            id: ["#app"]
        }
    });

router.route(
    {
        "/error": {
            component: [Component.E],
            id: ["#app"]
        }
    });

router.onError = function (err)
{
    // let it be handled by the server.
};

router.listen();

