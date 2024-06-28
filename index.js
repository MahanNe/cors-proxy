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
    if (!targetURL) {
        res.status(400).send({ error: 'Missing Target-URL header in the request' });
        return;
    }

    request({ url: targetURL, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
        function (error, response, body) {
            if (error) {
                console.error('Error proxying request:', error);
                res.status(500).send({ error: 'Error proxying request' });
                return;
            }

            // Forward the response from Pinterest back to the client
            res.send(body);
        });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
