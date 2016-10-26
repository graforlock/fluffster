var router = require('../dist').router,
    utils = require('../dist/utils'),
    Component = require('./component');

utils.each(document.querySelectorAll('.link'), function (link)
{
    link.addEventListener('click', function (e)
    {
        e.preventDefault();
        router.link(
            {
                pathname: e.target.pathname,
                search: e.target.search
            });
    });
});

document.querySelector('#increment-message').addEventListener('click', function ()
{
    router.send('incrementTest');
});

document.querySelector('#decrement-message').addEventListener('click', function ()
{
    router.send('decrementTest');
});

router.defaultErrorHandler = false;

router.global(
    {
        hello: "Hello"
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
setInterval(function ()
{

    increment += 1;
    var mainStream$ = router.stream();
    mainStream$.plug(utils.emit({hello: "Yello " + increment}));

}, 1000);

router.listen();
