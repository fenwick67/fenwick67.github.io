const fs = require("node:fs/promises")
const yaml = require("yaml")
const pug = require('pug')

async function build(opts){
    await fs.mkdir("dist",{recursive: true});
    (await fs.readdir("src")).filter(s=>s.indexOf('yml') == s.length - 3)
    .forEach(async (ymlFilename)=>{
            const shortname = ymlFilename.replace(/\..+$/gi,"");
            const data = yaml.parse(await fs.readFile(`./src/${ymlFilename}`,'utf-8'));
            const template = pug.compile(await fs.readFile(`./src/${shortname}.pug`),opts);
            fs.writeFile(`dist/${shortname}.html`, template(data));
        }
    );
}

module.exports= {build}