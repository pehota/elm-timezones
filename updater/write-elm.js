module.exports = {};

const TIMEZONES_FILE_DIR = './src/Time';
const TIMEZONES_FILE_PATH = `${TIMEZONES_FILE_DIR}/Timezones.elm`;
const debug = val => {
  console.log('===> ', val);
  return val;
};

const getType = val => {
  switch (true) {
    case typeof val === 'string':
      return 'string';
    // case val === Infinity
    case !isNaN(val) && val % 1 > 0:
      return 'float';
    case !isNaN(val):
      return 'int';
    case Array.isArray(val):
      return 'array';
    case typeof val === 'object':
      return 'object';
  }
};

const writeRecordFromObject = obj =>
  `{ ${Object.keys(obj).map(key => `${key} : ${toElmValue(obj[key])}`)} }`;

const toElmValue = val => {
  switch (getType(val)) {
    case 'int':
      return val;
    case 'float':
      return val;
    case 'string':
      return `"${val}"`;
    case 'object':
      return writeRecordFromObject(val);
    case 'array':
      return `[${val.map(toElmValue)}]`;
    default:
      return `"${toString(val)}"`;
  }
};

const elmTZName = name => name.toLowerCase().replace(/\W+/g, '_');

const writeZone = ({ name, eras }) =>
  `${elmTZName(name)} : Zone
${elmTZName(name)} =
  Zone ${toElmValue(name)} ${toElmValue(eras)}`;

const openFileStream = () =>
  new Promise((resolve, reject) => {
    try {
      const fs = require('fs');
      fs.mkdir(TIMEZONES_FILE_DIR, err => {
        if (err) reject(`Could not create file ${TIMEZONES_FILE_PATH}`);
        resolve(fs.createWriteStream(TIMEZONES_FILE_PATH));
      });
    } catch (e) {
      reject(`Could not create writing stream. Error: ${e}`);
    }
  });

const write = str => writer =>
  new Promise((resolve, reject) => {
    try {
      writer.write(str);
      resolve(writer);
    } catch (e) {
      reject(`Could not write to stream. Error: ${e} `);
    }
  });

const writeModuleHeader = write(`module Time.Timezones exposing (..)`);

const writeModuleContents = timezonesInfo => writer =>
  Promise.all(
    timezonesInfo.map(tz => write(`\n${writeZone(tz)}`)(writer))
  ).then(() => Promise.resolve(writer));

const closeStream = writer => Promise.resolve(writer.end());

const formatFile = () =>
  new Promise((resolve, reject) => {
    const exec = require('child_process').exec;
    exec(`yarn format-elm`, err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });

const writeElm = tzInformation =>
  openFileStream()
    .then(writeModuleHeader)
    .then(writeModuleContents(tzInformation))
    .then(closeStream)
    .then(formatFile);

module.exports.writeElm = writeElm;
