const fs = require('fs');
const path = require('path');
const stylesFolderPath = (path.join(__dirname, 'styles'))
const distFolderPath = (path.join(__dirname, 'project-dist'))
const outputStylesPath = path.join(distFolderPath, 'bundle.css')

fs.access(outputStylesPath, err => {
  if (err) {
    bundleStyles()
  } else {
    fs.promises.rm(outputStylesPath, { recursive: true, force: true })
      .then(() => bundleStyles())
  }
})

function bundleStyles() {
  fs.promises.readdir(stylesFolderPath).then(fileArray => {
    for (const file of fileArray) {
      fs.stat(path.join(stylesFolderPath, file), (err, stats) => {
        if (err) {
          console.error(err);
        } else {
          if (stats.isFile() && path.extname(file) === '.css') {
            let stylePath = path.join(stylesFolderPath, file)
            fs.readFile(stylePath, (err, data) => {
              fs.appendFile(outputStylesPath, data, () => {
                console.log('added ' + file);
              })
            })
          }
        }
      })
    }
  })
}

