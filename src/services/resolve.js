import toRegex from 'path-to-regexp';
import Promise from 'bluebird';

function matchURI(path, uri)
{
    const keys = [];
    const pattern = toRegex(path, keys);
    const match = pattern.exec(uri);
    if (!match) return null;
    const params = Object.create(null);
    for (let i = 1; i < match.length; i++)
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
        for (let i = 0; i < routes.length; i++)
        {
            let route = routes[i],
                path = Object.keys(route)[0];
            const uri = context.error ? '/error' : context.pathname;
            const params = matchURI(path, uri);
            if (!params) continue;
            const result = route;
            result[path].appState.params = params;
            if (result) return resolve(result[path]);
        }
        const error = new Error('Not found');
        error.status = 404;
        return reject(error);
    });
}
export default Resolve;