var router = require('../dist').router,
    h = require('virtual-dom/h'),
    diff = require('virtual-dom/diff'),
    createElement = require('virtual-dom/create-element');


var Component = {
    state: { test: 0 },
    app: document.getElementById('app'),
    update: function (newValue)
    {
            Component.state = newValue;
            Component.diffTree();
    },
    diffTree: function()
    {
        if(!this.tree)
        {
            this.tree = this.render();
            this.init();
        }
        else
        {
            diff(this.tree, this.render());
        }
    },
    init: function()
    {
        this.app.appendChild(this.tree);
    },
    subscribe: function (stream)
    {
        stream.onValue(function (value)
        {
            Component.update(value);
        });
    },
    render: function()
    {
        return createElement(
            h('h1',
                {},
                ['render! test state is ' + JSON.stringify(Component.state.test)]));
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

