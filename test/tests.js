var test = require('tape'),
    fluffster = require('../');


test('Module imports.', t =>
{
    var setup = {
      exported : ['state', 'router', 'utils', 'drivers']
    };

    t.plan(5);

    t.equal(typeof fluffster, 'object', '-> exports a valid object module');
    setup.exported.forEach(exp =>
    {
        t.equal(exp in fluffster, true, '-> exports ' + exp);
    });

    t.end();

});



