var express = require("express");
var fs = require("fs");
var path = require("path");
var LangEn = require("./en");
var LangEn2 = require("./en-2");
var LangZn = require("./zh");
var imageArr = require("./imageArr");
var xlsx = require("node-xlsx").default;
var iconv = require("iconv-lite");
var router = express.Router();
var axios = require("axios");
const https = require('https');
const http = require('http');
const puppeteer = require('puppeteer');

// 翻译
router.get("/abc", async function (req, res, next) {
    var ObjectIndex = 0;
    try {
        var url = 'https://translate.google.com/?hl=zh-cn&sl=auto&tl=vi&text=待提现订单&op=translate'
        var text = await translate(url)
        res.render("index", { title: text });
    } catch (error) {
        console.error('下载图片失败:', error);
    }
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

    if (!text) {
        throw new Error('第' + ObjectIndex + '对象未找到翻译');
    }

    ObjectIndex++;

    // 关闭浏览器
    await browser.close();

    return text;
}   

module.exports = router;
