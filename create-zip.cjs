const fs = require('fs');
const AdmZip = require('adm-zip');

const zip = new AdmZip();

function addFolder(dir, base) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'project-source.zip' || file === 'etc-pulwama-export.tar.gz' || file === 'etc-pulwama-export.zip') continue;
    const fullPath = dir + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addFolder(fullPath, base + file + '/');
    } else {
      zip.addLocalFile(fullPath, base);
    }
  }
}

addFolder(__dirname, '');
zip.writeZip(__dirname + '/public/project-source.zip');
console.log('Zip created');
