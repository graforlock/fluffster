var utils = require('./utils'),
    Singleton = utils.Singleton,
    thennable = utils.thennable;


function ServiceProvider(provider)
{
    this.provider = this.providerCheck(provider);
}

ServiceProvider.prototype.providerCheck = function (provider)
{
    return { isPromise: thennable(provider), _value: provider };
};

ServiceProvider.prototype.then = function (resolve, reject)
{
    if(this.provider.isPromise)
    {
        return this.provider._value.then(resolve, reject);
    }

    return resolve(this.provider._value);
};

module.exports = Singleton(ServiceProvider);

