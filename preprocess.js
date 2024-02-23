import { exec } from 'child_process';
import fs from 'fs';
import util from 'util';
import path from 'path';

import { objectFilter } from './src/util.js';

const execPromise=util.promisify(exec);

let config=JSON.parse(fs.readFileSync('./config.json','utf-8'));
let logFileLocation=config.LogDataCacheFileLocation;
let parserLocation=config.LogParserEXELocation;

fs.copyFileSync(logFileLocation+"\\ApiDataCache.json","./public/ApiData.json");

fs.copyFileSync(logFileLocation+"\\LogDataCache.json","./LogDataCache.json");
let logDataCache=fs.readFileSync("./LogDataCache.json");
logDataCache=JSON.parse(new TextDecoder('utf-8',{ ignoreBOM: false }).decode(logDataCache)).LogsByFilename;

let parsedDataCache=[];

try {
    parsedDataCache=JSON.parse(fs.readFileSync("./ParsedDataCache.json"));
}catch(e){}
parsedDataCache=new Set(parsedDataCache);

let fileNames=Object.keys(logDataCache);
let total=fileNames.length;

let result={};
try {
    result=JSON.parse(fs.readFileSync("./public/LogData.json")).LogsByFilename;
    /*
    result=Object.keys(result).filter(key=>{
        return !key.includes('Program');
    }).reduce((res,key)=>(res[key]=result[key],res),{});
    */
}catch(e){}

let i=0;

for(let fileName of fileNames)
{
    let isSkipped=parsedDataCache.has(fileName);
    if(!isSkipped)
    {
        let cmd=parserLocation+"/GuildWars2EliteInsights.exe -p \""+fileName+"\"";
        let { stdout }=await execPromise(cmd);
        let outputFileName=stdout.split("\r\n")[2].slice("Generated: ".length);
        result[outputFileName]=logDataCache[fileName];
        result[outputFileName].outputFileName=path.basename(outputFileName);
        delete result[outputFileName].FileName;
        parsedDataCache.add(fileName);
    }
    i++;
    console.log(i+"/"+total+((isSkipped)?" (already parsed, so it's skipped. :D)":""));
    //if(i==5) break; // for test
}

// clear

let temp=new Set(parsedDataCache);

for(let fileName of fileNames)
    temp.delete(fileName);

console.log(Object.keys(result).length)

for(let fileName of [...temp])
{
    let filter=path.parse(fileName).name;
    parsedDataCache.delete(fileName);
    result=objectFilter(result,(row)=>{
        let result=!row.outputFileName.includes(filter);
        if(!result)
            fs.unlinkSync("./public/Logs/"+row.outputFileName);
        return result;
    })
}

console.log(Object.keys(result).length)


fs.writeFileSync("./public/LogData.json",JSON.stringify({Version: 2,LogsByFilename: result}));

fs.writeFileSync("./ParsedDataCache.json",JSON.stringify([...parsedDataCache]));
