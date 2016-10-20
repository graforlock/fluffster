var router = require('../src/router'),
    compareTo = require('../src/utils').compareTo;

var Component = {
    state: null,
    update: function(newValue) {
        if(!compareTo(newValue, Component.state))
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
    render: function()
    {
        console.log('render! test state is', Component.state);

        /* It will not re-render if state is the same */
        Component.update(Component.state);
    }
};

setTimeout(function()
{
    router.link(
        {
            pathname: '/test',
            search: ''
        });

},3000);

document.querySelector('#test-3').addEventListener('click', function(e)
{
    e.preventDefault();

    router.link(
        {
            pathname: e.target.pathname,
            search: e.target.search
        });
});

router.route(
    {
        "/": {
            component: [Component],
            id: [],
            appState: {
                test: 1
            }
        }
    });

router.route(
    {
        "/test": {
            component: [Component],
            id: [],
            appState: {
                test: 2
            }
        }
    });

router.route(
    {
        "/another/:id": {
            component: [Component],
            id: [],
            appState: {
                test: 3
            }
        }
    });

router.listen();

