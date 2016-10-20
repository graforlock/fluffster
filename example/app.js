var router = require('../dist').router,
    compareTo = require('../src/utils').compareTo;

var Component = {
    state: null,
    update: function (newValue)
    {
        if (!compareTo(newValue, Component.state))
        {
            Component.state = newValue;
            Component.render();
        }
    },
    subscribe: function (stream)
    {
        stream.onValue(function (value)
        {
            Component.update(value);
        });
    },
    render: function ()
    {
        console.log('render! test state is ' + JSON.stringify(Component.state));

        /* It will not re-render if state is the same */
        Component.update(Component.state);
    }
};

setTimeout(function ()
{
    router.link(
        {
            pathname: '/test',
            search: ''
        });

}, 3000);

document.querySelector('#test-3').addEventListener('click', function (e)
{
    e.preventDefault();

    router.link(
        {
            pathname: e.target.pathname,
            search: e.target.search
        });
});


router.defaultErrorHandler = false;

router.route(
    {
        "/": {
            /* @View */
            component: [Component],
            /* @Model */
            appState: {
                test: 1
            },
            /* @Update */
            updates: {

                incrementTest: function (appState)
                {
                    return {test: appState.test + 1};
                },

                decrementTest: function (appState)
                {
                    return {test: appState.test - 1};
                }
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
            }
            /* @Update */

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

router.listen();

