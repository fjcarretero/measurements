/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index');
};
  
exports.base = function(req, res){
    res.render('base');
};

exports.layout = function(req, res){
    console.log('layout');
    res.sendfile('index.html');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    console.log(name);
    res.render('partials/' + name);
};