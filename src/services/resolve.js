var toRegex = require('path-to-regexp');
var Promise = require('bluebird');

function matchURI(path, uri)
{
    var keys = [];
    var pattern = toRegex(path, keys);
    var match = pattern.exec(uri);
    if (!match) return null;
    var params = Object.create(null);
    for (var i = 1; i < match.length; i++)
    {
        params[keys[i - 1].name] =
            match[i] !== undefined ? match[i] : undefined;
    }
    return params;
}

function Resolve(routes, context)
{
    return new Promise(function (resolve, reject)
    {
        for (var i = 0; i < routes.length; i++)
        {
            var route = routes[i],
                path = Object.keys(route)[0];
            var uri = context.error ? '/error' : context.pathname;
            var params = matchURI(path, uri);
            if (!params) continue;
            var result = route;
            result[path].appState.params = params;
            if (result) return resolve(result[path]);
        }
        var error = new Error('Not found');
        error.status = 404;
        return reject(error);
    });
}

module.exports = Resolve;