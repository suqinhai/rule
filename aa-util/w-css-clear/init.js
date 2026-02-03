const fs = require('fs');
const { parse } = require('@vue/compiler-sfc');
const cssnano = require('cssnano');
const postcss = require('postcss');
const { PurgeCSS } = require('purgecss');

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

// 使用 PurgeCSS 代替 UnCSS
new PurgeCSS()
  .purge({
    content: [tempHtmlPath],  // 使用临时 HTML 分析
    css: [{ raw: css }],      // 传入原始 CSS
  })
  .then(async (result) => {
    if (!result || !result[0] || !result[0].css) {
      console.error('PurgeCSS Error: No CSS output');
      fs.unlinkSync(tempHtmlPath);
      return;
    }

    const purgedCss = result[0].css;

    // 使用 cssnano 优化 CSS
    try {
      // Custom PostCSS plugin to keep only rules with class selectors
      const keepOnlyClasses = () => {
        return {
          postcssPlugin: 'keep-only-classes',
          Rule(rule) {
            // Check if any selector in the rule is a class selector (starts with .)
            const hasClassSelector = rule.selectors.some(selector => selector.trim().startsWith('.'));
            if (!hasClassSelector) {
              rule.remove(); // Remove the entire rule if no class selector
            }
          },
        };
      };
      keepOnlyClasses.postcss = true;

      // Now process with the filter plugin before cssnano
      const optimized = await postcss([
        keepOnlyClasses(), // Add this first to filter
        cssnano({ preset: 'default' })
      ]).process(purgedCss, { from: undefined });
      
      // const optimized = await postcss([cssnano({ preset: 'default' })]).process(
      //   purgedCss,
      //   { from: undefined }
      // );

      // 输出最终优化 CSS
      fs.writeFileSync('./dist/style-optimized.css', optimized.css);
      console.log('Optimized and merged CSS generated');

      // 删除临时文件
      fs.unlinkSync(tempHtmlPath);
    } catch (cssnanoError) {
      console.error('cssnano Error:', cssnanoError);
      fs.unlinkSync(tempHtmlPath);
    }
  })
  .catch((purgeError) => {
    console.error('PurgeCSS Error:', purgeError);
    fs.unlinkSync(tempHtmlPath);
  });
