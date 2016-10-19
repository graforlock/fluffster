export const compareTo = (a, b) /* :boolean */ =>
{
    /* Compares data object using simple string comparison. */

    return JSON.stringify(a) === JSON.stringify(b);
};

export const each = (elements, fn) /* :void */ =>
{
    /* A minimal forEach implementation, just like underscore's _.each() .*/

    for (var i = 0; i < elements.length && !fn(elements[i], i++););
};

export const extend = (obj, extension) /* :void */ =>
{
    /* Extends object in place. Beware, mutable! */

    for (var key in extension)
    {
        obj[key] = extension[key];
    }
};

export const extendMany = (...objects) /* :object */ =>
{
    /* Extends/reduces objects and returns a new object. */

    return [...objects].reduce((a, b) =>
    {

        for (var key in b)
        {
            a[key] = b[key];
        }
        return a;
    }, {});

};