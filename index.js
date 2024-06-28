var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

// Inside your server-side proxy code
app.all('*', function (req, res, next) {
    var targetURL = req.header('Target-URL');
    console.log('Request received for:', targetURL);

    request({ url: targetURL + req.url, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
        function (error, response, body) {
            if (error) {
                console.error('Error:', error);
                res.status(500).send({ error: 'Error proxying request' });
                return;
            }

            console.log('Response from Pinterest:', body);
            res.send(body); // Send the response from Pinterest back to the client
        });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
