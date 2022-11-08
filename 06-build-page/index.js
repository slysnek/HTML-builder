const fs = require('fs')
const path = require('path')

const distFolderPath = path.join(__dirname, 'project-dist')
const stylesFolderPath = path.join(__dirname, 'styles')
const stylesFolderDistPath = path.join(__dirname, 'project-dist', 'styles')

const templatePath = path.join(__dirname, 'template.html')
const componentsPath = path.join(__dirname, 'components')

buildPage();

async function buildPage() {

  await fs.promises.access(distFolderPath)
    .catch((err) => undefined)
    .then(() => fs.promises.rm(path.join(distFolderPath), { recursive: true, force: true })).catch((err) => console.log("ошибка в удалении"))
    .then(() => fs.promises.mkdir(path.join(distFolderPath)))
  await fs.promises.copyFile(templatePath, path.join(__dirname, './project-dist/index.html'))
  let page = await fs.promises.readFile(path.join(__dirname, `./project-dist/index.html`), 'utf-8')
  const components = await fs.promises.readdir(componentsPath, { withFileTypes: true })

  components.forEach(async function (component) {
    const componentCode = await fs.promises.readFile(path.join(componentsPath, `${component.name}`), 'utf-8')
    let componentTemplate = component.name
    let componentName = path.basename(componentTemplate, path.extname(component.name))
    let componentRes = `{{${componentName}}}`
    page = page.replace(componentRes, componentCode)
    await fs.promises.writeFile(path.join(__dirname, 'project-dist/index.html'), page, (err) => {
      if (err) console.error(err)
    })
  })

  /*   async function bundleStyles() {
    fs.promises.readdir(stylesFolderPath)
      .then(fileArray => {
        for (const file of fileArray) {
          fs.promises.stat(path.join(stylesFolderPath, file))
            .then((stats) => {
              if (stats.isFile() && path.extname(file) === '.css') {
                let stylePath = path.join(stylesFolderPath, file)
                fs.readFile(stylePath, (err, data) => {
                  if (err) console.error(err + 'style1');
                  fs.promises.appendFile(outputStylesPath, data)
                    .catch(err => console.log(err + 'style2'))
                })
              }
            })
        }
      })
  } */

  const outputStylesPathStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'))
  fs.promises.readdir(stylesFolderPath, { withFileTypes: true }).then((styles) => {
    for (const style of styles) {
      if (path.extname(style.name) === '.css') {
        const inputStylesPathStream = fs.createReadStream(path.join(__dirname, 'styles', style.name), 'utf8')
        inputStylesPathStream.on('data', chunk => outputStylesPathStream.write(chunk))
      }
    }
  })

  /*   function copyAssets() {
      fs.promises.readdir(assetsFolderPath)
        .then(folderArray => {
          console.log(folderArray);
          for (const folder of folderArray) {
            fs.promises.readdir(path.join(assetsFolderPath, folder))
              .then(fileArray => {
                console.log(fileArray);
                    }) */

  const assetsFolderPath = path.join(__dirname, 'assets')
  const assetsFolderDistPath = path.join(__dirname, 'project-dist', 'assets')
  copyAssets(assetsFolderPath, assetsFolderDistPath)

  async function copyAssets(assetsFolderPath, assetsFolderDistPath) {
    fs.mkdir(path.join(assetsFolderDistPath), (err) => {
      if (err) console.error(err);
      fs.promises.readdir(assetsFolderPath, { withFileTypes: true })
        .then((assetArray) => assetArray.forEach(asset => {
          if (asset.isDirectory()) {
            copyAssets(path.join(assetsFolderPath, `./${asset.name}`),
              path.join(assetsFolderDistPath, `./${asset.name}`))
          } else if (asset.isFile()) {
            fs.copyFile(path.join(assetsFolderPath, `./${asset.name}`),
              path.join(assetsFolderDistPath, `./${asset.name}`), (err)=>{
                if (err) console.error(err);
              })
          }
        }))
    })
  }
}
