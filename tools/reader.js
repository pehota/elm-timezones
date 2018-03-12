// node tiils/reader.js file=africa
const { promisify } = require('util');
const fs = require('fs');
const args = process.argv.reduce(function ( acc, arg , index) {
  let [key, val] = arg.split('=');

  if (index === 0) {
    val = key;
    key = 'node_location';
  } else if (index === 1) {
    val = key;
    key = 'script';
  }
  return {
    ...acc,
    [key]: val,
  };
}, {});


if (!('file' in args) && !('dir' in args)) {
  console.error('Error: Neither file nor dir arguments provided');
  process.exit(1);
}

console.log('finish up file loading');
