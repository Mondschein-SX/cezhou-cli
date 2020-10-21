#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require('fs');
const init = require('../packages/commands/init');
const build = require('../packages/commands/build');

// var config = {};

// // 配置文件如果存在则读取
// if (fs.existsSync(path.resolve('cz.config.js'))) {
//   config = require(path.resolve('cz.config.js'));
// }

// 创建工程
program
  .version('1.0.0', '-v, --version')
  .usage('[command]')
  .command('init')
  .description('initialize your project')
  .action(init);

// 生成图表压缩包
program
  .command('build')
  .description('generate chart compression packages')
  .action(build);

program.parse(process.argv);
