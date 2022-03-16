/**
 * File used to create absolute path of files in params.
 * Instead of 'require(../../models/something.js)', we can do 'include('models/something.js').
 */

global.abs_path = function(path) {
    return __dirname + '/..' + path;
}

global.include = function(file) {
    return require(abs_path('/' + file));
}
