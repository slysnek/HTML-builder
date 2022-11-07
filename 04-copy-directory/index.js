const fs = require('fs');
const path = require('path')
const folderPath = path.join(__dirname, 'files')
const folderCopyPath = path.join(__dirname, 'files-copy')

fs.access(folderCopyPath, err => {
  if (err) {
    fs.promises.mkdir(folderCopyPath)
      .then(() => copyFiles())
  } else {
    fs.promises.rm(folderCopyPath, { recursive: true, force: true })
      .then(() => fs.promises.mkdir(folderCopyPath))
      .then(() => copyFiles())
  }
})

function copyFiles() {
  fs.promises.readdir(folderPath)
    .then(fileArray => {
      for (const file of fileArray) {
        let filePath = path.join(folderPath, file)
        let destPath = path.join(folderCopyPath, file)
        fs.copyFile(filePath, destPath, () => console.log('File has been copied!'))
      }
    })
}

