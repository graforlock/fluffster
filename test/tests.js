var test = require('tape'),
    F = require('../src/fluffster');

/* @Global */
var G = new F({a: 2});

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

    G.updateState({a : 5});

    t.equals(G.state.a, 5);

    t.end();
});
