---
title: 智能家居安装
contributors: [nakata5321, PaTara43]
tools:
  - Home Assistant 2024.6.2
    https://github.com/home-assistant/core
  - Robonomics Home Assistant Integration 1.8.6
    https://github.com/airalab/homeassistant-robonomics-integration
  - IPFS 0.29.0
    https://docs.ipfs.tech/
  - Zigbee2MQTT 1.38.0
    https://github.com/Koenkk/zigbee2mqtt
---

**欢迎来到安装带有Robonomics集成的Home Assistant指南。Home Assistant是一个开源的家庭自动化系统，提供了一个集中控制智能设备的中心枢纽，使您能够控制家庭网络中的智能设备。通过与Robonomics集成，一个去中心化的云服务，您可以增强智能家居的功能和安全性。在本文中，我们将提供逐步说明，教您如何安装带有Robonomics的Home Assistant，让您能够使用安全且去中心化的解决方案自动化和控制家中的各个方面。让我们开始吧！**

{% roboWikiPicture {src:"docs/home-assistant/INSTALLATION.png", alt:"installation"} %}{% endroboWikiPicture %}

## 演示

这是一个完整的智能家居和Robonomics集成安装的示例。请注意，所需时间可能会因网络连接。

{% roboWikiVideo {videos:[{src: 'QmULXX4rjkuHuCF42c3V37MxEk6HpnFpJF4bZSQPR2c3Xo', type: 'mp4'}], attrs:['loop', 'controls', 'autoplay']} %}{% endroboWikiVideo %}

## 安装所需的硬件

如果您尚未将Home Assistant整合到您的智能家居设置中，了解您需要建立完整智能家居系统所需的设备是很重要的。Robonomics团队建议使用Raspberry Pi 4作为智能家居服务器。**但也可以在您的个人电脑上设置所有内容。**


{% roboWikiGridWrapper {columns: '3', textAlign: 'center', flexible: true} %}
	{% roboWikiGrid %} {% roboWikiPicture {src:"docs/home-assistant/need_2.png", alt:"need"} %}{% endroboWikiPicture %}
	<b>Raspberry Pi 4（至少2GB RAM）</b>
	{% endroboWikiGrid %}
	{% roboWikiGrid %} 	{% roboWikiPicture {src:"docs/home-assistant/need_3.png", alt:"need"} %}{% endroboWikiPicture %}
	<b>SD卡16GB</b> {% endroboWikiGrid %}{% roboWikiGrid %} 	{% roboWikiPicture {src:"docs/home-assistant/need_7.png", alt:"need"} %}{% endroboWikiPicture %}
	<a href="https://www.zigbee2mqtt.io/information/supported_adapters.html" target="_blank"> <b> Zigbee 适配器（可选） </b> </a>  {% endroboWikiGrid %}
{% endroboWikiGridWrapper %}

{% roboWikiGridWrapper {columns: '2', textAlign: 'center'} %}
	{% roboWikiGrid %} {% roboWikiPicture {src:"docs/home-assistant/need_5.png", alt:"need"} %}{% endroboWikiPicture %}
	 <a href="https://www.zigbee2mqtt.io/supported-devices/" target="_blank"> <b> Zigbee 智能设备（可选） </b> </a>  {% endroboWikiGrid %}
	{% roboWikiGrid %} 	{% roboWikiPicture {src:"docs/home-assistant/need_9.png", alt:"need"} %}{% endroboWikiPicture %}
	<b>用于设置的桌面</b>  {% endroboWikiGrid %}
{% endroboWikiGridWrapper %}


## 1. 安装前提条件

Robonomics Docker 包含：
- Home Assistant
- IPFS
- MQTT Broker 和集成- Zigbee2MQTT
- libp2p代理
- Robonomics集成

本文将展示在Ubuntu系统上的安装过程。首先，您需要安装以下软件包：

```
sudo apt-get install wget unzip git jq
```

然后，您需要在PC上安装Docker。安装说明请查看[官方网站](https://docs.docker.com/engine/install/)。

{% roboWikiNote {type: "warning", title: "重要信息"}%} 将您的用户添加到docker组，以便无需root权限启动docker容器。查看[此处的说明](https://docs.docker.com/engine/install/linux-postinstall/)。 {% endroboWikiNote %}

## 2. 配置

下载GitHub存储库并进入其中：

```
git clone https://github.com/airalab/home-assistant-web3-build.git
cd home-assistant-web3-build/
```

然后，从`template.env`创建一个`.env`文件：

```
cp template.env .env
```

之后，您可以打开`.env`文件并编辑默认值，例如：
- 存储所有配置文件夹的存储库路径。
- ["tz数据库名称"](https://en.wikipedia.org/wiki)中的时区。/List_of_tz_database_time_zones).

## 3. 开始

运行bash脚本并等待直到安装所有必需的软件包：

{% codeHelper {copy: true}%}

```
bash setup.sh
```

{% endcodeHelper %}

脚本将检查您在之前步骤中完成的所有必需操作，并在出现问题时抛出错误。

在安装过程中可能会出现以下情况：
- 如果您决定不使用Zigbee协调器，您将看到一个对话框行，确认是否继续安装：

{% codeHelper %}

```
this script will create all necessary repositories and start docker containers
Cannot find zigbee coordinator location. Please insert it and run script again. The directory /dev/serial/by-id/ does not exist
Do you want to continue without zigbee coordinator? It will not start Zigbee2MQTT container.
Do you want to proceed? (Y/n)
```

{% endcodeHelper %}


- 如果您的计算机上有多个使用串口的设备，脚本将询问要使用哪个设备：

{% codeHelper %}

```
this script will create all necessary repositories and start docker containers
the zigbee coordinator is installed
You have more that 1 connected devices. Please choose one
1) /dev/serial/by-id/usb-ITEAD_SONOFF_Zigbee_3.0_USB_Dongle_Plus_V2_20240123142833-if00
2) /dev/serial/by-id/usb-Silicon_Labs_Sonoff_Zigbee_3.0_USB_Dongle_Plus_0001-if00-port0
#?
```

{% endcodeHelper %}

## 安装后

一切就绪后，您可以使用 `update.sh` 脚本来更新 Docker 软件包的版本。该脚本将下载新版本，删除旧版本的软件包，并自动重新启动一切，保存所有配置。

要停止一切，请使用 `stop.sh` 脚本。


就是这样。继续阅读下一篇文章。