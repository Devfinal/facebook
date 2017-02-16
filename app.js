var express = require('express');
var app = express();
var fs = require('fs')
var Horseman = require('node-horseman');
var phantom = require('phantom');
var async = require( 'async' );
var horseman = new Horseman({
  timeout: 7000,
  loadImages: false,
  ignoreSSLErrors: true
});
app.set('view engine', 'pug');
app.get('/normal/*', function (req, res) {
  var str = req.query.urls;
  var urls = str.split(",");
  console.log(urls);
  renderviews(urls, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("ok");
    }
  });
  function renderviews(urls, callback) {
    var array = [];
    var temp = {};
    async.eachSeries(urls, function(url, callback) {
      runHorseman(url, (err, result) => {
          if(err) {
            callback(err);
          }
          temp = {
            video_url:"http://tools.dojoapp.co/fb_videos.php?urls=" + url,
            views:result
          };
        array.push(temp);
        callback(null)
      })
    }, function (err) {
      console.log("------------------------------------");
      if(err) {
        callback(err);
      }
      console.log("***********************************");
      res.render('video', {
        result:array
      });
      callback(null)
    });
  }
  function runHorseman(url, callback) {
    horseman.open('http://tools.dojoapp.co/fb_videos.php?urls='+url)
    .wait(3000)
    .switchToFrame(0)
    .html()
    .then(function(html) {
      if(html.match(/([0-9,]*) views/i)) {
        var theviews = parseInt(html.match(/([0-9,]*) views/i)[1].replace(/,/ig,''));
        console.log(theviews);
        var date = new Date();
        console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + url + ' ' + theviews);
        callback(null, theviews)
      } else if (html.match(/unavailable/i)){
        callback(null)
      } else {
        callback(0)
      }
    })
    .catch(function(e){
      callback(e)
    })
    // horseman.open('http://tools.dojoapp.co/fb_videos.php?urls='+url)
    // .wait(3000)
    // .switchToFrame(0)
    // .html('div._53j5._37u6')
    // .then(function(url) {
    //   console.log("url");
    //   console.log(url);
    //   callback(null);
    // })
  }
})
app.get('/restricted/*', function (req, res) {
  horseman
  .cookies([ { domain: '.facebook.com',
      httponly: false,
      name: 'presence',
      path: '/',
      secure: true,
      value: 'EDvF3EtimeF1484595876EuserFA21B09663787938A2EstateFDutF1484595876784CEchFDp_5f1B09663787938F0CC' },
    { domain: '.facebook.com',
      httponly: false,
      name: 'p',
      path: '/',
      secure: false,
      value: '-2' },
    { domain: '.facebook.com',
      expires: 'Wed, 16 Jan 2019 19:44:35 GMT',
      expiry: 1547667875,
      httponly: true,
      name: 'datr',
      path: '/',
      secure: false,
      value: 'mCJ9WLvyxNHLmEZeI4RT2rCU' },
    { domain: '.facebook.com',
      expires: 'Wed, 16 Jan 2019 19:44:35 GMT',
      expiry: 1547667875,
      httponly: true,
      name: 'lu',
      path: '/',
      secure: true,
      value: 'ggttUt6cOSJtImIRLVSX0fIA' },
    { domain: '.facebook.com',
      expires: 'Sun, 16 Apr 2017 19:44:35 GMT',
      expiry: 1492371875,
      httponly: true,
      name: 'pl',
      path: '/',
      secure: true,
      value: 'n' },
    { domain: '.facebook.com',
      expires: 'Sun, 16 Apr 2017 19:44:35 GMT',
      expiry: 1492371875,
      httponly: true,
      name: 's',
      path: '/',
      secure: true,
      value: 'Aa6hjUZfgdTbPNOo.BYfSKZ' },
    { domain: '.facebook.com',
      expires: 'Sun, 16 Apr 2017 19:44:35 GMT',
      expiry: 1492371875,
      httponly: false,
      name: 'csm',
      path: '/',
      secure: false,
      value: '2' },
    { domain: '.facebook.com',
      expires: 'Sun, 16 Apr 2017 19:44:35 GMT',
      expiry: 1492371875,
      httponly: true,
      name: 'xs',
      path: '/',
      secure: true,
      value: '28%3Ax-3P-HIEhGQvhg%3A2%3A1484595865%3A-1' },
    { domain: '.facebook.com',
      expires: 'Sun, 16 Apr 2017 19:44:35 GMT',
      expiry: 1492371875,
      httponly: false,
      name: 'c_user',
      path: '/',
      secure: true,
      value: '100009663787938' },
    { domain: '.facebook.com',
      expires: 'Wed, 16 Jan 2019 19:44:35 GMT',
      expiry: 1547667875,
      httponly: true,
      name: 'sb',
      path: '/',
      secure: true,
      value: 'mSJ9WIPNDgZTj8Sdk7XEy8KT' },
    { domain: '.facebook.com',
      expires: 'Sun, 16 Apr 2017 19:44:35 GMT',
      expiry: 1492371875,
      httponly: true,
      name: 'fr',
      path: '/',
      secure: false,
      value: '0wmkPO3XRsoUpN523.AWVL-1BcL_BQRI2lhIvcW0bTz0A.BYfSKY.k8.AAA.0.0.BYfSKZ.AWUuw906' } ]
    )
  .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36')
  .open(req.query.urls)
  .then(function() {
    console.log('restricted ' + req.query.urls)
  })
  .waitForSelector('.fcg')
  .text('._1vx9')
  .then(function(text) {
    if(text.match(/([0-9,]*) views/i)) {
      res.json({views:parseInt(text.match(/([0-9,]*) views/i)[1].replace(/,/ig,''))})
    } else if (text.match(/unavailable/i)){
      res.json({views:null})
    } else {
      res.json({views:0})
    }
  })
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
