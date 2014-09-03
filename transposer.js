var transposer = require('transposer')

// json payload
var json = {
  'soap:env': {
    'soap:head': {
      'soap:faulto': "some value"
    },
    'soap:body': {
      'runtimedata':{
        'tickets': [{
            "id": 1,
            "artist": 'beyonce',
            "price": 70
          },{
            "id": 2,
            "artist": 'bisbal',
            "price": 20
          },{
            "id": 3,
            "artist": 'bonjovi',
            "price": 10
          }
        ]
      }
    }
  }
}
// Execute
main();

//----------------------------------------------

function main() {

  // get all artists
  // result: ["beyonce","bisbal","bonjovi"]
  // performance: 0ms
  path('$..artist');

  // get the cheap ticket artists
  // result: ["bisbal","bonjovi"]
  // performance: 1ms
  path('$..tickets[?(@.price<30)]..artist');

  // get bonjovi's price
  // result: [10]
  // performance: 0ms
  path('$..tickets[?(@.artist=bonjovi)]..price');

  // Jquery like syntax
  // Bon Jovi's price is: number 10
  var bonjoviPrice = $('..tickets[?(@.artist=bonjovi)]..price', json, 0);
  log("Bon Jovi's price is:", typeof bonjoviPrice, bonjoviPrice);
}

//----------------------------------------------

/**
 * HELPERS
 */

function log() {
  console.log.apply(null,arguments);
}

function measure(fn) {
  log()
  var start = new Date;
  log('result: %s', JSON.stringify(fn()));
  log('performance: %sms' , new Date - start);
  log()
}

function path(expression) {
  var selectorFn = transposer(expression);
  measure(function() {
      return selectorFn.evaluate(json);
  });
}

function $(selector, json, index) {
  var selectorFn = transposer('$' + selector);
  try {
    var result = selectorFn.evaluate(json);
    if (index != null) {
        return result[index];
    } 
    return result;
  } catch (e) {
    return [];
  }
}




