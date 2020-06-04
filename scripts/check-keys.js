const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs').promises;


const srcFile = argv.src;
const originFile = argv.org;

// console.log('src', srcFile);
// console.log('org', originFile)

function checkObject (origin, source, path = '') {
  _.forEach(origin, (v, key) => {
    // console.log(key, v);
    if (_.isObject(v)) {
      const sourceObj = source[key]
      if (!_.isObject(sourceObj)) {
        console.log(`${path}${key} has to be object`)
      } else {
        checkObject(v, sourceObj, path ? `${path}.${key}.` : `${key}.`);
      }
    } else {
      if (!_.has(source, key)) {
        console.log(`${path}${key} is missing`)
      }
    }
  })
}

async function run () {
  const source = JSON.parse(await fs.readFile(srcFile));
  const origin = JSON.parse(await fs.readFile(originFile));

  checkObject(origin, source);
}

run()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch(e => {
    console.error(e);
    process.exit(1)
  })
