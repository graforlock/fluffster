var h = require('virtual-dom/h'),
    diff = require('virtual-dom/diff'),
    createElement = require('virtual-dom/create-element');

var Component = {

    app: document.querySelector('#app h2'),

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