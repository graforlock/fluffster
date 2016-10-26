var router = require('../dist').router,
    utils = require('../dist/utils'),
    Component = require('./component').react;

//router.defaultErrorHandler = false;

router.driver('react');

router.global(
    {
        hello: "Yello 0"
    });

router.route(
    {
        "/": {
            /* @View */
            component: [Component],
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
            component: [Component],
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
            component: [Component],
            id: ["#app"],
            /* @Model */
            appState: {
                test: 3
            }
            /* @Update */

        }
    });

router.route(
    {
        "/error": {
            /* @View */
            component: [Component],
            id: ["#app"],
            /* @Model */
            appState: {
                test: 404
            }
            /* @Update */

        }
    })
    .orElse(function()
    {

    });

/* Testing the global update */
var increment = 0;

setInterval(function()
{
    increment += 1;
    var mainStream$ = router.stream();
    mainStream$.plug(utils.emit({hello: "Yello " + increment % 100}));

}, 1000);

router.listen();
