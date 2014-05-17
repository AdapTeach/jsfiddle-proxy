var express = require('express'),
    app = express(),
    http = require('http'),
    env = process.env.DYNO ? 'production' : 'development';

app.set('port', process.env.PORT || 5000);

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.methodOverride());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
        //res.header("Access-Control-Allow-Headers", 'Authorization");
        next();
    });
    app.use(app.router);
    app.use(error);

    function error(err, req, res, next) {
        console.error(err.stack);
        res.send(500);
    }
});


app.listen(app.get('port'), function() {
    console.log("API listening on port " + app.get('port'));
});

app.get('/fiddle/:id',function(req,res){

    console.log(req.headers['user-agent']);
    var url = 'http://jsfiddle.net/AdapTeach/' + req.params.id + '/';
    if(req.headers['user-agent'].indexOf('PhantomJS') !== -1){
        url += "embedded/";
    }
    http.get(url, function(response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            res.send(chunk);
        });
    });

});
