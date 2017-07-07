var express = require('express');
var app = express();

app.use(express.static('public'));

app.get("/saletime", function(req, res) {

  var now = new Date();
  var dayend = new Date();

  now.setMinutes(now.getMinutes() + now.getTimezoneOffset() - 5*60);
  dayend.setMinutes(dayend.getMinutes() + dayend.getTimezoneOffset() - 5*60)

  dayend.setHours(24);
  dayend.setMinutes(0);
  dayend.setSeconds(0);
  dayend.setMilliseconds(0);

  // res.send((17 * 60 * 60 * 1000 - 50 * 1000).toString());
  res.send((
    dayend.getTime() - now.getTime() +
    5*60*60*1000
  ).toString());

});

app.listen(8082, function () {
  console.log('Example app listening on port 8082!')
})
