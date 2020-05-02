const fs = require('fs');
const ftp = require("basic-ftp")
const chokidar = require('chokidar');


const REMOTE_RECORDINGS_PATH = 'files/';
const RECORDS_DIR = '/usr/bin/recordings';

const log = (data) => {
  console.log(new Date(), data)
};

log("App started");
let init = true;

const getSorterFilesFromDir = () => {
  const files = fs.readdirSync(RECORDS_DIR)
    .map(function(v) {
      return { name:v,
        time: fs.statSync(RECORDS_DIR + '/' + v).mtime.getTime()
      };
    })
    .sort(function(a, b) { return a.time - b.time; })
    .map(function(v) { return v.name; });

  console.log(files);
  return files;
};



chokidar.watch(RECORDS_DIR).on('add', (event, path) => {

  if (!init) {
    log(`New File created ${path}`);
    fs.readdir(RECORDS_DIR, function () {
      const filesSorted = getSorterFilesFromDir();
      send(filesSorted[filesSorted.length - 2])
    })
  }
});

const getFileName = (filePath) => {
  console.log(filePath);
  const split = filePath.split('/');

  return split[split.length - 1];
};

setTimeout(() => {
  init = false;
  log("Finished initializing, Listening");
}, 1000);

async function send(fileName) {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  log('Connecting to ftp');

  try {
    await client.access({
      host: "77.55.217.143",
      user: "ftptest",
      password: "qwe",
    });
    log("Connected to ftp ");
    log(`Trying to upload file with name: ${fileName}`);

    await client.uploadFrom(RECORDS_DIR + "/" + fileName, REMOTE_RECORDINGS_PATH + fileName)
    log(`UPLOADED FILE: ${fileName}`);
  }

  catch(err) {
    log(`Something went wrong with uploading file :(: ${fileName}`);
  }
}


// send();


