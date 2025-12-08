const uncss = require('uncss');
const fs = require('fs');
const { parse } = require('@vue/compiler-sfc');
const cssnano = require('cssnano');
const postcss = require('postcss');

// 读取 .vue 文件
const vueFile = fs.readFileSync('./src/App.vue', 'utf8');

// 解析 .vue 文件，提取 template
const { descriptor } = parse(vueFile);
const templateContent = descriptor.template ? descriptor.template.content : '';

// 将 template 写入临时 HTML 文件
const tempHtmlPath = './temp.html';
fs.writeFileSync(tempHtmlPath, templateContent);

// 读取 CSS 文件（假设 CSS 已提取）
const cssPath = './dist/style.css';
let css;
try {
  css = fs.readFileSync(cssPath, 'utf8');
} catch (error) {
  console.error(`Error: Could not read ${cssPath} - ${error.message}`);
  fs.unlinkSync(tempHtmlPath); // 清理临时文件
  process.exit(1);
}

// 使用临时 HTML 文件运行 UnCSS
const files = [tempHtmlPath];
uncss(files, { raw: css }, (uncssError, uncssOutput) => {
  if (uncssError) {
    console.error('UnCSS Error:', uncssError);
    fs.unlinkSync(tempHtmlPath);
    return;
  }

  // 使用 cssnano 合并重复类并优化 CSS
  postcss([cssnano({preset: 'default'})])
    .process(uncssOutput, { from: undefined })
    .then((result) => {
      // 将优化后的 CSS 写入文件
      fs.writeFileSync('./dist/style-optimized.css', result.css);
      console.log('Optimized and merged CSS generated');

      // 删除临时文件
      fs.unlinkSync(tempHtmlPath);
    })
    .catch((cssnanoError) => {
      console.error('cssnano Error:', cssnanoError);
      fs.unlinkSync(tempHtmlPath);
    });
});