var express = require("express");
var fs = require("fs");
var path = require("path");
var LangEn = require("./en");
var LangZn = require("./zh");
var LangVi = require("./vi");
var imageArr = require("./imageArr");
var xlsx = require("node-xlsx").default;
var iconv = require("iconv-lite");
var router = express.Router();
var axios = require("axios");
const https = require('https');
const http = require('http');
const puppeteer = require('puppeteer');
// const imageUrl = 'https://www.999aee.com/mobile/mc/upgrade-bg.adf05721.png'; // 替换为实际URL

var filePath = path.join(__dirname, "../files"); // 替换为你的文件夹名称
var htmlArr = [];



// 获取.xls文件内容
router.get("/bbb", function (req, res, next) {
  const filePath = path.join(__dirname, "./");
  const workSheetsFromFile = xlsx.parse(filePath + "your-file.xlsx");
  var fieldsData = {}
  workSheetsFromFile[0].data.forEach((item) => {
    fieldsData[item[0]] = item[1];
    // if(LangVi[item[0]]){
    //   LangVi[item[0]] = item[1];
    // }
  });


  Object.keys(LangVi).forEach((item)=>{
    if(!fieldsData[item]){
      console.log(item)
    }
  })

  res.render("index", { title: '1' });
});

router.get("/aaa", function (req, res, next) {
  var bb = {};
  for (var b in LangEn) {
    bb[b] = LangVi[b];
    if(!LangVi[b]){
      console.log(b)
    }
  }
  res.render("index", { title: '1' });
});

router.get("/ccc", function (req, res, next) {
  downloadImagesSequentially(imageArr, path.join(__dirname, "../images"))
  res.render("index", { title: '1' });
})

// 翻译
router.get("/abc", async function (req, res, next) {
  var data = {}
  Object.keys(LangZn).forEach((key, index) => {
    if(index < 100 && index != 0){
      data[key] = LangZn[key]
    }
  })
  res.render("index", { title: JSON.stringify(data) });
});


async function translate(url) {
  // 启动无界面浏览器
  const browser = await puppeteer.launch({
    headless: true, // 无界面模式
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // 提升性能参数
  });

  // 创建新页面
  const page = await browser.newPage();

  // 设置用户代理（可选）
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  // 访问包含图片的网页
  await page.goto(url, {
    waitUntil: 'networkidle2', // 等待网络空闲
    timeout: 30000 // 超时时间30秒
  });

  // 从页面中提取图片URL（这里假设我们要下载第一个img标签的图片）
  const text = await page.evaluate(() => {
    const spanElement = document.querySelector('.ryNqvb');
    const content = spanElement.textContent;
    return content;
  });

  // 关闭浏览器
  await browser.close();

  return text;
}



async function downloadImagesSequentially(imageArr, filePath) {
  for (const urlImage of imageArr) {
    const savePath = path.join(filePath, getImageFileInfo(urlImage));

    // 执行下载，并等待 3 秒再处理下一个图片
    await downloadImage(urlImage, savePath)
      .then(() => console.log(`Downloaded: ${urlImage}`))
      .catch((err) => console.error(`Error downloading ${urlImage}: ${err.message}`));

    // 等待 3 秒
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  console.log('All images downloaded!');
}

/* GET home page. */
router.get("/", function (req, res, next) {
  htmlArr = [];

  //读取文件目录
  try {
    var files = fs.readdirSync(filePath);
    var count = files.length;
    var results = {};
    files.forEach(function (filename) {
      var stats = fs.statSync(path.join(filePath, filename));
      if (stats.isFile()) {
        if (
          getdir(filename) == "vue" ||
          getdir(filename) == "js" ||
          getdir(filename) == "css"
        ) {
          readFile(path.join(filePath, filename));
        }
      } else if (stats.isDirectory()) {
        var name = filename;
        ArrFiles(path.join(filePath, filename), name);
      }
    });
  } catch (err) {
    console.error("文件或目录不存在:", err);
  }
  console.log(disposalData(),33333)
  res.render("index", { title: disposalData() });
});

function disposalData() {
  var JSONdata = {};
  var JSONarr = []
  let len = 1;
  // let spaceBetween = 1000 // 间距
  // let start = 1000 //开始   [0,1000,2000,3000,4000,5000,6000,7000,8000]
  htmlArr.forEach((data, index) => {
    // 正则表达式，用于匹配 $t('...') 或 $t("...")
    const regex = /\$t\(['"]([^'"]+)['"]\)/g;
    // const regex = /https:\/\/www\.999aee\.com\/[^"'\s]*\.(png|jpg|gif)/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      // if( start < len && (start + spaceBetween) >= len ){
      //     console.log(len)
      //     JSONdata[match[1]] = match[1]
      // }
      ++len;
      // JSONdata.push(match[0])
      JSONdata[match[1]] = match[1];
    }
  });
  // for(var a in JSONdata){
  //   JSONarr.push(a)
  // }
  // downloadAllImages(JSONarr)
  return JSON.stringify(JSONdata);
}


async function downloadImage(url, savePath) {
  try {
    // 启动无界面浏览器
    const browser = await puppeteer.launch({
      headless: true, // 无界面模式
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // 提升性能参数
    });

    // 创建新页面
    const page = await browser.newPage();

    // 设置用户代理（可选）
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // 访问包含图片的网页
    await page.goto(url, {
      waitUntil: 'networkidle2', // 等待网络空闲
      timeout: 30000 // 超时时间30秒
    });

    // 从页面中提取图片URL（这里假设我们要下载第一个img标签的图片）
    const imageUrl = await page.evaluate(() => {
      const img = document.querySelector('img');
      return img ? img.src : null;
    });

    if (!imageUrl) {
      throw new Error('未找到图片');
    }

    // 下载图片
    const response = await page.goto(imageUrl);
    const buffer = await response.buffer();

    // 保存图片到本地
    fs.writeFileSync(savePath, buffer);
    console.log(`图片已下载到: ${savePath}`);

    // 关闭浏览器
    await browser.close();

  } catch (error) {
    console.error('下载图片失败:', error);
  }
}

const getImageFileInfo = (url) => {
  // 获取路径中的最后一部分（文件名）
  const fileNameWithPath = url.split('/').pop();

  // 分离文件名和扩展名
  const fileName = fileNameWithPath.split('.')[0]; // 文件名部分
  const fileType = fileNameWithPath.split('.').pop(); // 文件类型（扩展名）

  return (fileName + '.' + fileType);
}



// //获取后缀名
function getdir(url) {
  var arr = url.split(".");
  var len = arr.length;
  return arr[len - 1];
}

//获取文件数组
function ArrFiles(readurl, name) {
  var name = name;
  var files = fs.readdirSync(readurl);
  files.forEach(function (filename) {
    var stats = fs.statSync(path.join(readurl, filename));
    //是文件
    if (stats.isFile()) {
      if (
        getdir(filename) == "vue" ||
        getdir(filename) == "js" ||
        getdir(filename) == "css"
      ) {
        readFile(path.join(readurl, filename));
      }
      //是子目录
    } else if (stats.isDirectory()) {
      var dirName = filename;
      ArrFiles(path.join(readurl, filename), name + "/" + dirName);
    }
  });
}

function readFile(filePath) {
  var data = fs.readFileSync(filePath, "utf8");
  htmlArr.push(data);
}

module.exports = router;
