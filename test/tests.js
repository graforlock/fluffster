var test = require('tape'),
    F = require('../src/fluffster'),
    history = require('../src/services/history'),
    router = require('../src/router');

/* @Global */
var G = new F({a: 2}),
    Component = {
        subscribe: function (stream)
        {
            stream.onValue(function (value)
            {
                return value;
            });
        }
    };

test('#1 -> initialisation tests', function (t)
{
    t.plan(3);

    t.equals(typeof F, 'function');
    t.equals(typeof G.state, 'object');
    t.equals(G.state.a, 2);

    t.end();

});

test('#2 -> update tests', function (t)
{
    t.plan(1);

    G.updateState({a: 5});
    t.equals(G.state.a, 5);

    t.end();
});


test('#3 -> routing', function (t)
{
    t.plan(1);

    router.route(
        {
            "/": {
                component: [Component],
                id: [],
                appState: {}
            }
        });

    router.router(history.location);
    history.listen(router.router);

    t.end();

});