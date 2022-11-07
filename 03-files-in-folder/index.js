const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder')

fs.promises.readdir(folderPath).then(fileArray => {
  for (const file of fileArray) {
    fs.stat(path.join(folderPath, file), (err, stats) => {
      if (err) {
        console.error(err);
      } else {
        if (stats.isFile()) {
          console.log(path.basename(file, path.extname(file)) +
            ' - ' + path.extname(file).slice(1) +
            ' - ' + (stats.size / 1024).toFixed(2) + 'KB');
        }
      }
    })
  }
})
