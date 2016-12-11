var kefir = require('kefir'),
    React = require('react'),
    ReactDOM = require('react-dom');

var utils = {
    ajax: function ajax(method, options)
    {
        if (this instanceof ajax)
        {

            var params = options.params ? this.serialize(options.params) : null;
            var state = 0,
                deferred,
                status,
                value;

            function resolve(result)
            {
                value = result;
                state = result.readyState;
                status = result.status;

                if (deferred)
                {
                    handle(deferred);
                }
            }

            function handle(resolvers)
            {
                if (state < 4)
                {
                    deferred = resolvers;
                    return;
                }

                var handler;
                if (status >= 200)
                {
                    if (status >= 300)
                    {
                        resolvers.rejected({statusText: xhttp.statusText, statusCode: status});
                    } else
                    {
                        resolvers.resolved(xhttp.responseText);
                    }
                }

            }

            this.then = function (resolved, rejected)
            {
                handle({
                    resolved: resolved,
                    rejected: rejected || this.defaultError
                });
            }.bind(this);

            this.defaultError = function (err)
            {
                console.warn("404: Bad request.");
            };

            var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            xhttp.onreadystatechange = function ()
            {
                resolve(xhttp);
            };
            xhttp.open(method.toUpperCase(), options.url, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
        }
        else
        {
            return new ajax(method, options);
        }

    },
    compareTo: function (a, b) /* -> boolean */
    {
        /* Compares data object using simple string comparison. */

        return JSON.stringify(a) === JSON.stringify(b);
    },

    each: function (elements, fn) /* -> void */
    {
        /* A minimal forEach implementation, just like underscore's _.each() .*/

        for (var i = 0; i < elements.length && !fn(elements[i], i++););
    },

    emit: function (state, condition) /* -> stream */
    {
        /* Emits the stream. */

        return kefir.stream(function (emitter)
        {
            return emitter.emit(state);
        });
    },

    emitWhile: function (state, condition) /* -> stream? */
    {
        /* Emits the stream while the condition is true. */

        return this.emit(state)
            .takeWhile(condition);
    },

    extend: function (obj, extension) /* -> void */
    {
        /* Extends object in place. Beware, mutable! */

        for (var key in extension)
        {
            obj[key] = extension[key];
        }
    },

    extendMany: function () /* -> object */
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
    },
    noop: function ()
    {
    },
    serialize: {
        form: function (form)
        {
            var field, s = [];
            if (typeof form == 'object' && form.nodeName == "FORM")
            {
                var len = form.elements.length;
                for (i = 0; i < len; i++)
                {
                    field = form.elements[i];
                    if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button')
                    {
                        if (field.type == 'select-multiple')
                        {
                            for (j = form.elements[i].options.length - 1; j >= 0; j--)
                            {
                                if (field.options[j].selected)
                                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                            }
                        } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked)
                        {
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                        }
                    }
                }
            }
            return s.join('&').replace(/%20/g, '+');
        },
        object: function (obj)
        {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p))
                {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return str.join("&");
        }
    },
    renderLoop: function (components, id)
    {
        return function (props)
        {
            console.log(components);
            utils.each(components, function (Component, index)
            {
                ReactDOM.render(React.createElement(Component, props),
                    document.querySelector(id[index]));
            });
        }
    },
    Singleton: function (module)
    {
        return (function ()
        {
            var _instance;
            var _module = module;

            return {
                getInstance: function (params)
                {
                    if (!_instance)
                    {
                        _instance = new module(params);
                    }
                    return _instance;
                },
            }
        })();
    },
    thennable: function (object)
    {
        return Boolean(object.then);
    }
};

module.exports = utils;