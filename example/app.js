var router = require('../dist').router,
    utils = require('../dist/utils'),
    Component = require('./component');

router.defaultErrorHandler = false;

router.global(
    {
        hello: "Hello",
        increment: 0
    });

router.route(
    {
        "/": {
            /* @View */
            component: [Component],
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
            /* @Model */
            appState: {
                test: 404
            }
            /* @Update */

        }
    });

/* Testing the global update */
var increment = 0;

(function frame()
{
    increment += 1;
    var mainStream$ = router.stream();
    mainStream$.plug(utils.emit({hello: "Yello", increment: increment % 100}));
    window.requestAnimationFrame(frame);

})();

router.listen();
