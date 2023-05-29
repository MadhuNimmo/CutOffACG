const fs = require('fs');
const path = require('path');

const  regexcopyValue = /^\s*[\w\.]+\[[\w\d\s]*\]\s*=\s*[\w\.]+\[[\w\d\s]*\]\s*;/gm;


const folderPath = '/Users/madhurimachakraborty/Documents/todomvc-master/examples/canjs/'; // Replace with your folder path

function main(){
        const fileMap = new Map();
        readFilesRecursively(folderPath, fileMap);

        let matches = {};
        //console.log(fileMap)
        for( const [filename,filedata] of fileMap){
                while ((match = regexcopyValue.exec(filedata))) {
                        if(!(filename in matches)){
                                matches[filename]=[];
                        }
                        matches[filename].push(match[0]);
                        
                }       
                regexcopyValue.lastIndex=0;
        }
        console.log(matches);
}

function readFilesRecursively(dir, map = new Map()) {
        const files = fs.readdirSync(dir);
      
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
      
          if (stat.isDirectory()) {
            readFilesRecursively(filePath, map);
          } else {
            const data = fs.readFileSync(filePath, 'utf8');
            map.set(filePath, data);
          }
        });
      
        return map;
      }

main()