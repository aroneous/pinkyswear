var Prom = require('./promise');

// new Promise((res, err) => err('bad!'))
// .then(val => console.log('then before catch: ' + val))
// .catch(err => console.log('Caught: ' + err))
// .then(val => console.log('In then: ' + val))
// .then(val => console.log('In then 2: ' + val));

new Prom((res, err) => err('bad!'))
.then(val => console.log('then before catch: ' + val))
.catch(err => console.log('Caught: ' + err))
.then(val => console.log('In then: ' + val))
.then(val => console.log('In then 2: ' + val));
