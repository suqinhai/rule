// download.js (优化版)

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// --- 配置区 ---

// 1. 要剥离的 URL 前缀
const BASE_URL_TO_STRIP = 'https://8cc10086.com/country/nationalflag/';

// 2. 图片保存的根目录
const OUTPUT_DIR = path.join(__dirname, 'downloads');

// 3. 包含图片链接的文本文件名
const URL_LIST_FILE = 'urls.txt';
 
// --- 核心下载函数 ---

/**
 * 从给定的 URL 下载单个图片
 * @param {string} url - 图片的完整 URL
 * @returns {Promise<{status: string, path?: string, reason?: string}>}
 */
async function downloadImage(url) {
  try {
    // 1. 验证 URL 格式并生成本地保存路径
    if (!url.startsWith(BASE_URL_TO_STRIP)) {
      const reason = `URL前缀不匹配，应为 '${BASE_URL_TO_STRIP}'`;
      console.warn(`[跳过] ${reason}: ${url}`);
      return { status: 'skipped', reason };
    }
    const relativePath = url.substring(BASE_URL_TO_STRIP.length);
    const savePath = path.join(OUTPUT_DIR, relativePath);
    const dirPath = path.dirname(savePath);

    // 2. 确保目录存在
    await fs.promises.mkdir(dirPath, { recursive: true });

    console.log(`[开始] 正在下载: ${url}`);

    // 3. 发起网络请求
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 15000 // 增加15秒超时，防止请求永久挂起
    });

    // 4. 将数据流写入文件
    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);

    // 5. 等待写入完成
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`[成功] 已保存到: ${savePath}`);
        resolve({ status: 'success', path: savePath });
      });
      writer.on('error', (err) => {
        const reason = `写入文件时出错: ${err.message}`;
        console.error(`[错误] ${reason} -> ${savePath}`);
        reject({ status: 'error', reason });
      });
    });

  } catch (error) {
    let reason = '未知错误';
    if (error.response) {
      reason = `服务器错误 (HTTP ${error.response.status})`;
      console.error(`[失败] ${reason}: ${url}`);
    } else if (error.code === 'ECONNABORTED') {
      reason = '网络请求超时';
      console.error(`[失败] ${reason}: ${url}`);
    } else if (error.request) {
      reason = '网络错误 (无响应)';
      console.error(`[失败] ${reason}: ${url}`);
    } else {
      reason = `程序内部错误: ${error.message}`;
      console.error(`[失败] ${reason}: ${url}`);
    }
    return { status: 'error', reason };
  }
}

// --- 主执行函数 ---

async function main() {
  console.log('--- 开始批量下载任务 ---');

  // 1. 读取 urls.txt 文件
  let urls;
  try {
    const fileContent = await fs.promises.readFile(URL_LIST_FILE, 'utf-8');
    urls = JSON.parse(fileContent).map((item)=> item.icon)
    // urls = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
  } catch (err) {
    console.error(`错误：无法读取文件 '${URL_LIST_FILE}'。`);
    if (err.code === 'ENOENT') {
      fs.writeFileSync(URL_LIST_FILE, 'https://5bpg1.com/static/images/cv3n7/bg/main_bg.png' + '\n');
      console.log(`已为您创建示例文件 '${URL_LIST_FILE}'，请将您的链接填入后重新运行。`);
    }
    return;
  }
  
  if (urls.length === 0) {
    console.log('URL列表为空，任务结束。');
    return;
  }

  console.log(`发现 ${urls.length} 个链接，准备下载...`);

  let successCount = 0;
  const failedTasks = []; // <--- 新增：用于存储失败的任务信息

  // 2. 遍历所有 URL 并逐一下载
  for (const url of urls) {
    // 确保 url 不为空
    if(!url) continue;

    const result = await downloadImage(url);
    if (result.status === 'success') {
      successCount++;
    } else {
      // <--- 新增：将失败的任务信息存入数组
      failedTasks.push({ url, reason: result.reason });
    }
  }

  // --- 任务总结 ---
  console.log('\n--- 任务全部完成 ---');
  console.log(`总计: ${urls.length} 个`);
  console.log(`成功: ${successCount} 个`);
  console.log(`失败/跳过: ${failedTasks.length} 个`);
  
  // <--- 新增：如果存在失败任务，则打印详细列表
  if (failedTasks.length > 0) {
    console.log('\n--- 以下是失败或跳过的链接列表 ---');
    failedTasks.forEach(task => {
      console.log(`❌ URL: ${task.url}`);
      console.log(`   原因: ${task.reason}`);
    });
    console.log('\n你可以检查网络连接，或将上述失败的URL复制到一个新的 urls.txt 文件中重试。');
  }

  console.log(`\n所有成功下载的图片已保存到 '${OUTPUT_DIR}' 目录中。`);
}

// 启动脚本
main();
