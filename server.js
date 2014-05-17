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
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
        res.header('Access-Control-Allow-Methods', 'GET')
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

app.get('/fiddle/:id/:tabs',function(req,res){
    var url = 'http://jsfiddle.net/AdapTeach/' + req.params.id + '/';
//    if(req.headers['user-agent'].indexOf('PhantomJS') == -1){
//        url += "embedded/"+req.params.tabs+'/';
//        if(req.query.presentation){
//            url += 'presentation/'
//        }
//    }
    http.get(url,function(response){
        var html = ''
        response.on('data',function(data){
            html += data;
        }).on('end',function(){
            res.end(html);
        })
    })

});
