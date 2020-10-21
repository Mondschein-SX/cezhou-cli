const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const JSZip = require('jszip');

let choices = []; // 图表集合
let chartFile = ''; // 压缩对象名称
let zip = new JSZip(); // 压缩结果

const CURR_DIR = process.cwd();
const QUESTIONS = [
  {
    name: 'chart',
    type: 'list',
    message: 'Please select the chart folder that you want to package',
    choices: choices
  }
];

/**
 * 更新交互选项
 */
function updateOpts() {
  const currentPath = `${CURR_DIR}/charts`;
  const files = fs.readdirSync(currentPath);
  files.forEach(file => {
    const path = `${currentPath}/${file}`;
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      choices.push(file);
    }
  });
}

/**
 * 读取要压缩的文件夹
 * @param {*} obj 压缩对象
 * @param {*} path 目标路径
 */
function readFiles(obj, path) {
  let files = fs.readdirSync(path);
  files.forEach((fileName) => {
    let fillPath = path + '/' + fileName;
    let file = fs.statSync(fillPath);
    if (file.isDirectory()) {
      let dirList = zip.folder(fileName);
      readFiles(dirList, fillPath);
    } else {
      obj.file(fileName, fs.readFileSync(fillPath));
    }
  });
}

/**
 * 压缩文件
 * @param {*} path 目标路径
 */
function zipFiles(path) {
  zip.generateAsync({ // 设置压缩格式，开始打包
    type: 'nodebuffer', // nodejs用
    compression: 'DEFLATE', // 压缩算法
    compressionOptions: { // 压缩级别
      level: 9
    }
  }).then((content) => {
    fs.writeFileSync(path, content, 'utf-8');
  });
}

/**
 * 压缩完毕
 */
function complete() {
  console.log(chalk.blueBright('     build over...'));
}

module.exports = () => {
  updateOpts();

  inquirer.prompt(QUESTIONS)
    .then(answers => {
      chartFile = answers['chart'];
      var outputPath = path.join(CURR_DIR, 'dist.zip');
      var targetPath = path.join(CURR_DIR, `charts/${chartFile}`);

      readFiles(zip, targetPath);
      zipFiles(outputPath);

      // var ProgressBar = require('progress');
      // var bar = new ProgressBar(':bar :current/:total', { total: 50 });
      // var timer = setInterval(function () {
      //   bar.tick();
      //   if (bar.complete) {
      //     clearInterval(timer);
      //   } else if (bar.curr === 5) {
      //     bar.interrupt('this message appears above the progress bar\ncurrent progress is ' + bar.curr + '/' + bar.total);
      //   }
      // }, 100);

      setTimeout(() => complete(), 500);
    });
};
