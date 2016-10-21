var router = require('../dist').router,
    compareTo = require('../src/utils').compareTo;

var Component = {
    state: null,
    app: document.getElementById('app'),
    update: function (newValue)
    {
            Component.state = newValue;
            Component.render();
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
        this.app.innerHTML = '<h1>render! test state is <br>' + JSON.stringify(Component.state) + '</h1>';
    }
};

document.querySelector('#test-3').addEventListener('click', function (e)
{
    e.preventDefault();

    router.link(
        {
            pathname: e.target.pathname,
            search: e.target.search
        });
});

document.querySelector('#increment-message').addEventListener('click', function() {
    router.sendMessage('incrementTest');
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

