module.exports = {
    compareTo: function(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    },
    extend: function(destination, source) {
        for (var property in source) {
            if (source[property] && source[property].constructor &&
                source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                extend(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    }
};