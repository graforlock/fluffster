var kefir = require('kefir');

module.exports = {

    compareTo: function (a, b) /* :boolean */
    {
        /* Compares data object using simple string comparison. */

        return JSON.stringify(a) === JSON.stringify(b);
    },

    each: function (elements, fn) /* :void */
    {
        /* A minimal forEach implementation, just like underscore's _.each() .*/

        for (var i = 0; i < elements.length && !fn(elements[i], i++););
    },

    emit: function(state)
    {
        return kefir.stream(function (emitter)
        {
            return emitter.emit(state);
        })
    },

    extend: function (obj, extension) /* :void */
    {
        /* Extends object in place. Beware, mutable! */

        for (var key in extension)
        {
            obj[key] = extension[key];
        }
    },

    extendMany: function () /* :object */
    {
        /* Extends/reduces objects and returns a new object. */

        return [].slice.call(arguments).reduce(function (a, b)
        {

            for (var key in b)
            {
                a[key] = b[key];
            }
            return a;
        }, {});
    }

};