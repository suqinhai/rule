
第一步：
保存脚本install-vless-vpn.sh到亚马逊AWS服务器
sudo nano ./install-vless-vpn.sh
粘贴完脚本使用 ctrl+x  ->  Y -> enter
sudo chmod +x install-vless-vpn.sh && sudo ./install-vless-vpn.sh
	
第二步：
sudo nano /etc/xray/config.json
删除配置文件的注释，调整配置 
mtu为1350，
uplinkCapacity为3000,
downlinkCapacity为3000,
使用 ctrl+x  ->  Y -> enter保存

第三步
设置开机自启 (我们的脚本已经做过了):
sudo systemctl enable xray
重启服务 (修改配置后用这个):
sudo systemctl restart xray
检查服务的状态是否成功
sudo systemctl status xray


第四步
开启安全组TCP25642端口
开启安全组UDP25642端口

可以了


