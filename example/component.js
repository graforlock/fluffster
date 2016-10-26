var utils = require('../dist/utils'),
    router = require('../dist').router,
    React = require('react');

var helpers = {
        initLinks: function ()
        {

            utils.each(document.querySelectorAll('.link'), function (link)
            {
                link.addEventListener('click', function (e)
                {

                    /* router.link should only get event
                       should then change on unlisten()
                       to default routing.
                       TODO: TEST THE BEHAVIOR.*/

                    e.preventDefault();
                    router.link(
                        {
                            pathname: e.target.pathname,
                            search: e.target.search
                        });
                });
            });
        },
    initEvents: function()
    {
        document.querySelector('#increment-message').addEventListener('click', function ()
        {
            router.send('incrementTest');
        });

        document.querySelector('#decrement-message').addEventListener('click', function ()
        {
            router.send('decrementTest');
        });
    }
    };

var Component = {

    app: document.querySelector('#app h2'),
    initialised: false,

    init: function ()
    {
        helpers.initLinks();
        helpers.initEvents();
        return this;
    },

    update: function (data)
    {
        if (!this.initialised)
        {
            this.init();
            this.initialised = true;
        }
        this.app.innerHTML = JSON.stringify(data);
    },

    subscribe: function (data)
    {
        Component.update(data);
    },

};

var ReactComponent = React.createClass({
    componentWillMount: function()
    {
        helpers.initLinks();
        helpers.initEvents();
    },

    render: function ()
    {
        return React.createElement('h1', null, JSON.stringify(this.props));
    }
});


module.exports = {default: Component, react: ReactComponent};