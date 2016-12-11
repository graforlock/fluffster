var fluffster = require('../dist'),
    router = fluffster.router,
    utils = fluffster.utils,
    Component = require('./component').react,
    CONSTANTS = Component.CONSTANTS;

var ajax = utils.ajax;


router.driver('react');

/* handleErrorRoute() is future implementation
 for NON-SPA error route handling.

 Usage:

 router.handleErrorRoute();  */


router.global(
    {
        hello: "Yello 0"
    });

router.route(
    {
        "/": {
            /* @View */
            component: [Component.A],
            id: ["#app"],
            /* @Model */
            appState: {
                test: 1
            }
        }
    });

router.route(
    {
        "/test": {
            /* @View */
            component: [Component.B],
            id: ["#app"],
            /* @Model */
            appState: {
                test: 2
            },
            /* @Messages */
            messages: {
                incrementTest: function (state)
                {
                    return {test: state.test + 1};
                },
                decrementTest: function (state)
                {
                    return {test: state.test - 1};
                }
            }
        }
    });

router.route(
    {
        "/another/:id": {
            /* @View */
            component: [Component.C],
            id: ["#app"],
            /* @Model */
            appState: {
                test: 3
            },
            /* @Update */
            provider: function (state)
            {
                return ajax('GET',
                    { url: CONSTANTS.API + state.params.id });
            }
        }
    });

router.route(
    {
        "/error": {
            /* @View */
            component: [Component.E],
            id: ["#app"],
            /* @Model */
            appState: {
                test: 404
            }
            /* @Update */
            // None...
        }
    })
    .onError(function (err)
    {
        console.log(err)
    });

/* Testing the global update */
var increment = 0;

setInterval(function ()
{
    increment += 1;
    var mainStream$ = router.stream();
    mainStream$.plug(utils.emit({hello: "Yello " + increment % 100}));

}, 1000);

router.listen();
