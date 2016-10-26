var utils = require('../dist/utils'),
    router = require('../dist').router;

var Component = {

    app: document.querySelector('#app h2'),

    init: function()
    {
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

        console.log('init');

        return this;
    },

    update: function(data)
    {
        this.app.innerHTML = JSON.stringify(data);
    },

    subscribe: function (data)
    {
        Component.update(data);
    },

};

module.exports = Component;