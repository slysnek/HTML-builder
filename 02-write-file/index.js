const { stdin, stdout} = process;
const fs = require('fs');
const path = require('path');
const readline = require('readline')
const rline = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const filePath = path.join(__dirname, 'text.txt')

fs.createWriteStream(filePath);
stdout.write('Hello! Enter some text to add to the file:\n')
rline.on('line', line => {
    let text = line;
    if(text === 'exit'){
      process.exit()
    }
    fs.appendFile(filePath, text, err => {
      if (err) throw console.error(err);
      console.log('\nText was added. Enter some more text or type "exit" to end editing the file');
    })  
  })

process.on('exit', () => stdout.write('\nBye!'))
