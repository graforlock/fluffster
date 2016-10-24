var h = require('virtual-dom/h'),
    diff = require('virtual-dom/diff'),
    createElement = require('virtual-dom/create-element');

var Component = {

    state: {test: 0},
    app: document.getElementById('app'),

    update: function (newValue)
    {
        Component.state = newValue;
        Component.diffTree();
    },

    diffTree: function ()
    {
        if (!this.tree)
        {
            this.tree = this.render();
            this.init();
        }
        else
        {
            diff(this.render(), this.tree);
        }
    },

    init: function ()
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

    render: function ()
    {
        return createElement(
            h('h1',
                {},
                [
                    h('p', {}, ['render! test state is ']),
                    h('p', {}, [JSON.stringify(Component.state)])
                ]
            ));
    }

};

module.exports = Component;