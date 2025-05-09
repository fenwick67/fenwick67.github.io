const fs = require("node:fs/promises")
const yaml = require("yaml")
const pug = require('pug');
const path = require("node:path");

async function build(opts){
    await fs.mkdir("dist",{recursive: true});
    (await fs.readdir("src")).filter(s=>s.indexOf('yml') == s.length - 3).forEach(async (ymlFilename)=>{
        const shortname = ymlFilename.replace(/\..+$/gi,"");
        const data = yaml.parse(await fs.readFile(`./src/${ymlFilename}`,'utf-8'));
        const template = pug.compile(await fs.readFile(`./src/${shortname}.pug`),opts);
        fs.writeFile(`dist/${shortname}.html`, template(data));
    });

    (await fs.readdir("static")).forEach(async (s)=>{
        fs.cp(path.join("static",s), path.join("dist",s),{recursive:true});
    });
}

module.exports= {build}