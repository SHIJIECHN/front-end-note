---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 20. HTTPS
---

## HTTP的缺点
1. 通信实用明文（不加密），内容可能会被窃听。
2. 不验证通信用于的身份，因此可能遭遇伪装。
3. 无法证明报文的完整性，所以有可能已遭篡改。

## HTTPS
### 1. HTTPS组成
HTTPS = HTTP + 加密 + 认证 + 完整性保护。  
HTTPS只是HTTP通信接口部分用SSL（Secure Socket Layer，安全套接层）和TLS（Transport Layer Security，安全传输层协议）替代而已。所谓HTTPS，其实就是身披SSL协议这层外壳的HTTP。

<img :src="$withBase('/basicComputer/Network/HTTPS01.png')" alt="https"> 

采用SSL后，HTTP就拥有了HTTPS的加密、整数和完整性保护这些功能。也就是HTTP加上了加密处理和认证以及完整性跋扈后即是HTTPS。

<img :src="$withBase('/basicComputer/Network/HTTPS02.png')" alt="https"> 

### 2. SSL/TLS
HTTPS协议主要功能依赖于SSL/TLS协议，SSL/TLS的功能主要依赖于三类基本算法：非对称加密、对称加密、散列算法。

### 3. 加密（解决内容可能被窃听）
#### 对称加密
加密和解密用同一个秘钥的加密方式叫做对称加密。

#### 非对称加密
公钥和私钥。私钥智宝存在服务器端，公钥可以发送给所有的客户端。

HTTPS在交换秘钥环节使用非对称加密方式，之后的建立通信交换报文阶段使用对称加密方式。

公钥被中间人拿到篡改了。就会出现MITM（Man-in-the-MiddleAttack，中间人攻击）：
<img :src="$withBase('/basicComputer/Network/HTTPS04.png')" alt="https"> 

### 4. 数字签名（解决报文可能遭篡改）
公钥被掉包，是因为客户端无法分辨传回公钥的到底是中间人，还是服务器。
在HTTPS中，使用**证书+数字签名**解决这个问题。    
<img :src="$withBase('/basicComputer/Network/HTTPS03.png')" alt="https"> 
将网站的信息加密后通过第三方机构的私钥再次加密，生成数字签名

数字证书 = 网站信息+数字签名。   
假如中间人拦截后把服务器的公钥替换为自己的公钥，因为数字签名的存在，会导致客户端验证签名不匹配，这样就防止了中间人替换公钥的问题。
<img :src="$withBase('/basicComputer/Network/HTTPS05.png')" alt="https"> 
浏览器安装后会内置一些权威第三方认证机构的公钥，验证签名的时候直接就从本地拿到响应第三方机构的公钥，对私钥加密后的数组签名进行解密得到真正的签名，然后客户端利用这个签名生成规则进行签名生成，看两个签名是否匹配。

为什么要签名？
如果没有签名，只对网站信息进行第三方机构私钥加密的话，会存在下面的问题：
<img :src="$withBase('/basicComputer/Network/HTTPS06.png')" alt="https">

因为没有认证，所以中间人也向第三方认证机构进行申请，然后拦截后把所有的信息都替换成自己的，客户端仍然可以解密，并且无法判断这是服务器的还是中间人的，最后造成数据泄露。


## 整体流程
<img :src="$withBase('/basicComputer/Network/https.png')" alt="https">

