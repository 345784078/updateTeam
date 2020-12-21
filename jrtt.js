/*
邀请码：1188531898
我的--输入邀请码，立得一元，直接提现，谢谢

作者：执意ZhiYi-N
目前包含：
签到
开首页宝箱
读文章30篇（具体效果自测）
开农场宝箱
农场浇水
done 农场离线奖励(农场宝箱开完后，需要进农场再运行脚本才能开，有点问题)
##通过农场浇水激活上线，达到获取理想奖励目的，目前测试每天的离线奖励足够开启农场5个宝箱，不需要做其他任务，具体情况看后期是否需要，再添加除虫，开地，施肥，三餐奖励以及农场签到活动
20点睡觉，获取完全后（3600）或睡觉12小时，自动醒来（防止封号）
自动收取睡觉金币


脚本初成，非专业人士制作，欢迎指正

#右上角签到即可获取签到cookie
#进一次农场即可获取农场cookie
#读文章弹出金币获取读文章cookie

[mitm]
hostname = api3-normal-c-*.snssdk.com

#圈x
[rewrite local]
^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus) url script-request-header https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js
^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info url script-request-header https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js
[task]
5,35 8-23 * * * https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, tag=今日头条极速版, enabled=true

#loon
http-request ^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus) script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, requires-body=true, timeout=10, tag=今日头条极速版sign
http-request ^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, requires-body=true, timeout=10, tag=今日头条极速版farm
cron "5,35 8-23 * * *" script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, tag=今日头条极速版

#surge

jrttsign = type=http-request,pattern=^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus),requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0
jrttfarm = type=http-request,pattern=^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0
jrtt = type=cron,cronexp="5,35 8-23 * * *",wake-system=1,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0

*/
const jsname='今日头条极速版'
const $ = Env(jsname)
var tz=''
var farmurl = $.getdata('farmurl')
var farmkey = $.getdata('farmkey')

var signurl = $.getdata('signurl')
var signkey = $.getdata('signkey')

var readurl = $.getdata('readurl')
var readkey = $.getdata('readkey')
//var article = $.getdata('article')
var coins=''
let other = ''
var article =''
var collect = ''
var invited =''
const hour = (new Date()).getHours();
const minute = (new Date()).getMinutes();

//CK运行

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie();
   $.done()
} 

!(async () => {
await invite()
await userinfo()
await profit()
await sign_in()
await openbox()
await reading()
//await enter_farm()
await openfarmbox()
await landwarer()
await double_reward()
await sleepstatus()
await control()
//await sleepstart()
//await sleepstop()
//await collectcoins(coins)
await showmsg()
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    //$.msg($.name, $.subt, $.desc.join('\n')), $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
  })

function GetCookie() {
  const farmurlVal = "device_id=29825819299&device_platform=iphone&aid=35&os_version=14.3&update_version_code=80110&tma_jssdk_version=1.91.0.3&sid=&version_code=8.0.1&install_id=896849051923981&app_name=news_article_lite&device_type=iPhone13,1&channel=App%20Store&host_app_name=undefined&activity_id=&credit_type=  "
  const jrttfarmKey = JSON.stringify({"Content-Type":"application/json","x-Tt-Token":"005314662542a12a607b33d1c9a7c6cd7f00adcf376dc5022ed1da954447a763f0e71b522ba64f03bdd7f00627a5ec75ab83ef84f7db763e5c6f00876b92647feaca9cb69ad46196ff5d67727c423523f3963-1.0.0","x-tt-trace-id":"00-7f62c900096f1c1e2a33c89c43fa0023-7f62c900096f1c1e-01","Referer":"https://tmaservice.developer.toutiao.com/?appid=tta539d3843a134f3d&version=1.1.95","sdk-version":"2","X-SS-DP":"35","Host":"api3-normal-c-lq.snssdk.com","Accept-Encoding":"gzip, deflate","X-Gorgon":"8404209b800089d3a96a1747c726f5a70da878d268859d39e253","X-Khronos":"1608454948","X-SS-Cookie":"d_ticket=6e2bae40189619cf10f9d33f4d54fb74d8840; n_mh=RczYsGQ3p6pXSD_LjvnuQ_Dilm5aTjbRjGrA8Yq5fAU; odin_tt=4140e06c23686a9bc02cfe1cd4feba2f1e003dd00d26088aeda4c0cf0896d5ece9149f6f7098615bd3578dcfd672b8972fb4385c0d5e07d363589f09ee3ecabf; sessionid=5314662542a12a607b33d1c9a7c6cd7f; sessionid_ss=5314662542a12a607b33d1c9a7c6cd7f; sid_guard=5314662542a12a607b33d1c9a7c6cd7f%7C1608454882%7C5184000%7CThu%2C+18-Feb-2021+09%3A01%3A22+GMT; sid_tt=5314662542a12a607b33d1c9a7c6cd7f; uid_tt=f9724e526a9290339119daa78582af11; uid_tt_ss=f9724e526a9290339119daa78582af11; passport_csrf_token=f472e42c5e2ec1b4411cde92ff42c430; install_id=896849051923981; ttreq=1$558316ad3c74ee9c696d56391ec86173a50d31fd","passport-sdk-version":"5.12.1","tt-request-time":"1608454948745","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NewsArticle/8.0.1.10 JsSdk/2.0 NetType/WIFI (NewsLite 8.0.1 14.300000) NewsLite/8.0.1 Mobile ToutiaoMicroApp/1.91.0.3","x-tt-dt":"AAAVBPYCKF4QBER5TXCDFR7JUJQ4LMRVXGT4JYBH2ESY4WMGZDN7U43DFQUOZ7F6OFKAFIY43ZO744FFZSX3NDMA6SVWSEFGWA4XQ7R6P4OPWEVNL4NR25W7VUQ3W","Connection":"keep-alive","Cookie":"d_ticket=6e2bae40189619cf10f9d33f4d54fb74d8840;n_mh=RczYsGQ3p6pXSD_LjvnuQ_Dilm5aTjbRjGrA8Yq5fAU;odin_tt=4140e06c23686a9bc02cfe1cd4feba2f1e003dd00d26088aeda4c0cf0896d5ece9149f6f7098615bd3578dcfd672b8972fb4385c0d5e07d363589f09ee3ecabf;sessionid=5314662542a12a607b33d1c9a7c6cd7f;sessionid_ss=5314662542a12a607b33d1c9a7c6cd7f;sid_guard=5314662542a12a607b33d1c9a7c6cd7f%7C1608454882%7C5184000%7CThu%2C+18-Feb-2021+09%3A01%3A22+GMT;sid_tt=5314662542a12a607b33d1c9a7c6cd7f;uid_tt=f9724e526a9290339119daa78582af11;uid_tt_ss=f9724e526a9290339119daa78582af11;passport_csrf_token=f472e42c5e2ec1b4411cde92ff42c430;install_id=896849051923981;ttreq=1$558316ad3c74ee9c696d56391ec86173a50d31fd"})
  const signurlVal = "version_code=8.0.1&tma_jssdk_version=1.91.0.3&app_name=news_article_lite&vid=E426B80D-BC7B-48F9-A9BC-3D3F0F78CFFB&device_id=29825819299&channel=App%20Store&resolution=1125*2436&aid=35&ab_version=668905,1859936,668906,668908,668903,668904,2275670,668907,2285856,1626300,2254837,2279152&ab_feature=2183629,794528&review_flag=0&ab_group=2183629,794528&update_version_code=80110&openudid=cac96c5b5a04419fd2b60ea22948bbcdb951b263&pos=5pe9vb/88Pzt3vTp5L+9p72/ey4UeCoDv7GXvb2//vTp5L+9p72/ey4UeCoDv7GXvb2/8fLz+vTp6Pn4v72nvayspbOrr66qqamoqqmrqK+qpbGXvb2/8fzp9Ono+fi/vae9r6mzqqmqqa2krqSrqq2srqWksZe9vb/88Pzt0fzp9Ono+fi/vae9r6mzqqmqqa2krqSrqq2srqWksZe9vb/88Pzt0fLz+vTp6Pn4v72nvayspbOrr66qqamoqqmrqK+qpbGXvb2/8fL+/PHC8fzp+O7pwu3y7r+9p73ml729vb2/6fTw+O7p/PDtv72nvayrraWpqKmlpa6zramoqqWusZe9vb29v+3v8uv08/74v72nvb96OxJ4Jie/sZe9vb29v/706eS/vae9v3suFHgqA7+xl729vb2//vLy7/n08/zp+Mv88ej47r+9p73ml729vb29vb/x8vP69Ono+fi/vae9rKyls6uvrqqpqaiqqauor6qlsZe9vb29vb2/8fzp9Ono+fi/vae9r6mzqqmqqa2krqSrqq2srqWkl729vb3gsZe9vb29v/z5+e/47u6/vae9v3o7EngmJ3oBHHsuFHgqA3glH3oCLnoWM3glH7+Xvb3gl+A=&cdid=A3052228-B171-467B-AF02-C6FE71782129&idfv=E426B80D-BC7B-48F9-A9BC-3D3F0F78CFFB&ac=WIFI&os_version=14.3&ssmix=a&device_platform=iphone&iid=896849051923981&ab_client=a1,f2,f7,e1&device_type=iPhone13,1&idfa=00000000-0000-0000-0000-000000000000  "
  const jrttsignKey = JSON.stringify({"Content-Type":"application/json; encoding=utf-8","x-Tt-Token":"005314662542a12a607b33d1c9a7c6cd7f00adcf376dc5022ed1da954447a763f0e71b522ba64f03bdd7f00627a5ec75ab83ef84f7db763e5c6f00876b92647feaca9cb69ad46196ff5d67727c423523f3963-1.0.0","x-tt-trace-id":"00-7f621f10096f1c1e2a30fbc4c5bd0023-7f621f10096f1c1e-01","Accept":"application/json","Cookie":"install_id=896849051923981; ttreq=1$558316ad3c74ee9c696d56391ec86173a50d31fd; passport_csrf_token=f472e42c5e2ec1b4411cde92ff42c430; odin_tt=4140e06c23686a9bc02cfe1cd4feba2f1e003dd00d26088aeda4c0cf0896d5ece9149f6f7098615bd3578dcfd672b8972fb4385c0d5e07d363589f09ee3ecabf; n_mh=RczYsGQ3p6pXSD_LjvnuQ_Dilm5aTjbRjGrA8Yq5fAU; d_ticket=6e2bae40189619cf10f9d33f4d54fb74d8840; sid_guard=5314662542a12a607b33d1c9a7c6cd7f%7C1608454882%7C5184000%7CThu%2C+18-Feb-2021+09%3A01%3A22+GMT; uid_tt=f9724e526a9290339119daa78582af11; uid_tt_ss=f9724e526a9290339119daa78582af11; sid_tt=5314662542a12a607b33d1c9a7c6cd7f; sessionid=5314662542a12a607b33d1c9a7c6cd7f; sessionid_ss=5314662542a12a607b33d1c9a7c6cd7f; MONITOR_WEB_ID=80203ff8-43f8-40ef-9ec1-fffb639c0060","sdk-version":"2","passport-sdk-version":"5.12.1","X-SS-DP":"35","Host":"api3-normal-c-lq.snssdk.com","Accept-Encoding":"gzip, deflate","X-Gorgon":"840460148000fd8f6de640edf6a04636127cc4c5c9112e8fff60","X-Khronos":"1608454905","X-SS-Cookie":"d_ticket=6e2bae40189619cf10f9d33f4d54fb74d8840; n_mh=RczYsGQ3p6pXSD_LjvnuQ_Dilm5aTjbRjGrA8Yq5fAU; odin_tt=4140e06c23686a9bc02cfe1cd4feba2f1e003dd00d26088aeda4c0cf0896d5ece9149f6f7098615bd3578dcfd672b8972fb4385c0d5e07d363589f09ee3ecabf; sessionid=5314662542a12a607b33d1c9a7c6cd7f; sessionid_ss=5314662542a12a607b33d1c9a7c6cd7f; sid_guard=5314662542a12a607b33d1c9a7c6cd7f%7C1608454882%7C5184000%7CThu%2C+18-Feb-2021+09%3A01%3A22+GMT; sid_tt=5314662542a12a607b33d1c9a7c6cd7f; uid_tt=f9724e526a9290339119daa78582af11; uid_tt_ss=f9724e526a9290339119daa78582af11; passport_csrf_token=f472e42c5e2ec1b4411cde92ff42c430; install_id=896849051923981; ttreq=1$558316ad3c74ee9c696d56391ec86173a50d31fd","tt-request-time":"1608454905241","X-SS-STUB":"D41D8CD98F00B204E9800998ECF8427E","User-Agent":"NewsLite 8.0.1 rv:8.0.1.10 (iPhone; iOS 14.3; zh_CN) Cronet","Content-Length":"0","Connection":"keep-alive","x-tt-dt":"AAAVBPYCKF4QBER5TXCDFR7JUJQ4LMRVXGT4JYBH2ESY4WMGZDN7U43DFQUOZ7F6OFKAFIY43ZO744FFZSX3NDMA6SVWSEFGWA4XQ7R6P4OPWEVNL4NR25W7VUQ3W"})
  const readurlVal = "version_code=8.0.1&tma_jssdk_version=1.91.0.9&app_name=news_article_lite&vid=E426B80D-BC7B-48F9-A9BC-3D3F0F78CFFB&device_id=29825819299&channel=App%20Store&resolution=1125*2436&aid=35&ab_version=668905,1859936,668906,668908,668903,668904,2275670,668907,2285856,1626300,2254837,2279152&ab_feature=2183629,794528&review_flag=0&ab_group=2183629,794528&update_version_code=80110&openudid=cac96c5b5a04419fd2b60ea22948bbcdb951b263&pos=5pe9vb/88Pzt3vTp5L+9p72/ey4UeCoDv7GXvb2//vTp5L+9p72/ey4UeCoDv7GXvb2/8fLz+vTp6Pn4v72nvayspbOrr66qqamtrq+srKWtqLGXvb2/8fzp9Ono+fi/vae9r6mzqqmqqautrqSppKuor6qqsZe9vb/88Pzt0fzp9Ono+fi/vae9r6mzqqmqqautrqSppKuor6qqsZe9vb/88Pzt0fLz+vTp6Pn4v72nvayspbOrr66qqamtrq+srKWtqLGXvb2/8fL+/PHC8fzp+O7pwu3y7r+9p73ml729vb2/6fTw+O7p/PDtv72nvayrraWpqKmkqa2zqK+lrq6vpLGXvb29vb/t7/Lr9PP++L+9p72/ejsSeCYnv7GXvb29vb/+9Onkv72nvb97LhR4KgO/sZe9vb29v/7y8u/59PP86fjL/PHo+O6/vae95pe9vb29vb2/8fLz+vTp6Pn4v72nvayspbOrr66qqamtrq+srKWtqLGXvb29vb29v/H86fTp6Pn4v72nva+ps6qpqqmrra6kqaSrqK+qqpe9vb294LGXvb29vb/8+fnv+O7uv72nvb96OxJ4Jid6ARx7LhR4KgN4JR96Ai56FjN4JR+/l7294Jfg&cdid=A3052228-B171-467B-AF02-C6FE71782129&idfv=E426B80D-BC7B-48F9-A9BC-3D3F0F78CFFB&ac=WIFI&os_version=14.3&ssmix=a&device_platform=iphone&iid=896849051923981&ab_client=a1,f2,f7,e1&device_type=iPhone13,1&idfa=00000000-0000-0000-0000-000000000000&group_id=6908138940948038147  "
  const jrttreadKey = JSON.stringify({"x-Tt-Token":"005314662542a12a607b33d1c9a7c6cd7f00adcf376dc5022ed1da954447a763f0e71b522ba64f03bdd7f00627a5ec75ab83ef84f7db763e5c6f00876b92647feaca9cb69ad46196ff5d67727c423523f3963-1.0.0","x-tt-trace-id":"00-82e49d53096f1c1e2a30158851f60023-82e49d53096f1c1e-01","sdk-version":"2","X-SS-DP":"35","Host":"api3-normal-c-lq.snssdk.com","Accept-Encoding":"gzip, deflate","X-Gorgon":"8404204e0000309fc96a8638fc0f4a725a6682d44e0adf3c1fb1","X-SS-Cookie":"d_ticket=6e2bae40189619cf10f9d33f4d54fb74d8840; n_mh=RczYsGQ3p6pXSD_LjvnuQ_Dilm5aTjbRjGrA8Yq5fAU; odin_tt=4140e06c23686a9bc02cfe1cd4feba2f1e003dd00d26088aeda4c0cf0896d5ece9149f6f7098615bd3578dcfd672b8972fb4385c0d5e07d363589f09ee3ecabf; sessionid=5314662542a12a607b33d1c9a7c6cd7f; sessionid_ss=5314662542a12a607b33d1c9a7c6cd7f; sid_guard=5314662542a12a607b33d1c9a7c6cd7f%7C1608454882%7C5184000%7CThu%2C+18-Feb-2021+09%3A01%3A22+GMT; sid_tt=5314662542a12a607b33d1c9a7c6cd7f; uid_tt=f9724e526a9290339119daa78582af11; uid_tt_ss=f9724e526a9290339119daa78582af11; passport_csrf_token=f472e42c5e2ec1b4411cde92ff42c430; install_id=896849051923981; ttreq=1$558316ad3c74ee9c696d56391ec86173a50d31fd","passport-sdk-version":"5.12.1","tt-request-time":"1608513788892","User-Agent":"NewsLite 8.0.1 rv:8.0.1.10 (iPhone; iOS 14.3; zh_CN) Cronet","x-tt-dt":"AAAVBPYCKF4QBER5TXCDFR7JUJQ4LMRVXGT4JYBH2ESY4WMGZDN7U43DFQUOZ7F6OFKAFIY43ZO744FFZSX3NDMA6SVWSEFGWA4XQ7R6P4OPWEVNL4NR25W7VUQ3W","Connection":"keep-alive","Cookie":"install_id=896849051923981; ttreq=1$558316ad3c74ee9c696d56391ec86173a50d31fd; passport_csrf_token=f472e42c5e2ec1b4411cde92ff42c430; d_ticket=6e2bae40189619cf10f9d33f4d54fb74d8840; n_mh=RczYsGQ3p6pXSD_LjvnuQ_Dilm5aTjbRjGrA8Yq5fAU; odin_tt=4140e06c23686a9bc02cfe1cd4feba2f1e003dd00d26088aeda4c0cf0896d5ece9149f6f7098615bd3578dcfd672b8972fb4385c0d5e07d363589f09ee3ecabf; sessionid=5314662542a12a607b33d1c9a7c6cd7f; sessionid_ss=5314662542a12a607b33d1c9a7c6cd7f; sid_guard=5314662542a12a607b33d1c9a7c6cd7f%7C1608454882%7C5184000%7CThu%2C+18-Feb-2021+09%3A01%3A22+GMT; sid_tt=5314662542a12a607b33d1c9a7c6cd7f; uid_tt=f9724e526a9290339119daa78582af11; uid_tt_ss=f9724e526a9290339119daa78582af11; MONITOR_WEB_ID=80203ff8-43f8-40ef-9ec1-fffb639c0060","X-Khronos":"1608513788"})
    
  }
function sign_in() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let sign_inurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/task/sign_in/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sign_inurl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.err_no == 0) {
          other +='📣首页签到\n'
          other +='签到完成\n'
          other +='获得'+result.data.score_amount+'金币\n'
          other +='连续签到'+result.data.sign_times+'天\n'
  
}else{
          other +='📣首页签到\n'
          other +='今日已完成签到\n'
           }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

async function control(){
   if(collect == 0){
      await sleepstart();
 //$.log('qqqqq'+collect)
   }
   if(collect == 1){
  //$.log('1111111'+collect)
      await sleepstop();
      await collectcoins(coins);
   }
   if(collect == 2){
      $.log('no opreation')
      other +='\n\n生前何必久睡，死后自会长眠'
   }
   if(invited == 4){
      await invitation();
   }
}
function invite() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let inviteurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/user/new_tabs/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(inviteurl,(error, response, data) =>{
     const result = JSON.parse(data)
      // $.log(data)
      if(result.data.section[10].key=='mine_input_code') {
          invited=4;
           }else{
          invited=5;

}

        //$.msg(111)
          resolve()
    })
   })
  } 
function invitation() {
return new Promise((resolve, reject) => {
//$.log(signkey)
  let invitatonurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/invite/post_invite_code/?_request_from=web&device_platform=ios&ac=4G&${signurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
    body: JSON.stringify({"invitecode" : "1188531898"})
}

   $.post(invitatonurl,(error, response, data) =>{
     const result = JSON.parse(data)
       //$.log(data)
       //$.log('i000000')
        //$.msg(111)
          resolve()
    })
   })
  } 

function userinfo() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let userinfourl ={
    url: `https://api3-normal-c-hl.snssdk.com/passport/account/info/v2/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(userinfourl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.message == 'success') {
          other +='🎉'+result.data.name+'\n'
  
}     else if(result.message == 'error'){
          other += '⚠️异常:'+result.data.description+'\n'
           }else{
          other += '⚠️异常'
}
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

function profit() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let profiturl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/user/info/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(profiturl,(error, response, data) =>{
     const result = JSON.parse(data)
        //$.log(data)
      if(result.err_no == 0) {
          other +='🎉金币收益:'+result.data.score.amount+'\n🎉估计兑换现金:'+(result.data.score.amount/30000).toFixed(2)+'\n🎉'+'现金收益:'+result.data.cash.amount+'\n'
      //$.log('11111111'+result.data.cash.amount)
          
}else{
          other += '⚠️异常\n'
           }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

//文章阅读30篇每天
function reading() {
//$.log(article)
const articles = readurl.replace(/\d{3}$/,Math.floor(Math.random()*1000));
return new Promise((resolve, reject) => {
//$.log(article)
  let readurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/task/get_read_bonus/?${articles}`,
    headers :JSON.parse(readkey),
      timeout: 60000,
}

   $.post(readurl,(error, response, data) =>{
     const result = JSON.parse(data)
        $.log(data)
      if(result.err_no == 0) {
          other +='📣文章阅读\n'
          other +='阅读完成'
          other +='获得'+result.data.score_amount+'金币\n'
          other +='阅读进度'+result.data.icon_data.done_times+'/'+result.data.icon_data.read_limit+'\n'
      }
       if(result.err_no == 4){
          other +='📣文章阅读\n'
          other +='文章阅读已达上限\n'
        }
       if(result.err_no == 1028){
          other +='📣文章阅读\n'
          other +='这篇文章已经读过了\n'
        }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

function openbox() {
//$.log(farmkey)
return new Promise((resolve, reject) => {
//$.log(farmkey)
  let openboxurl ={
    url: `https://it-lq.snssdk.com/score_task/v1/task/open_treasure_box/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(openboxurl,(error, response, data) =>{
     const result = JSON.parse(data)
        $.log(data)
      if(result.err_no == 0) {
//$.log('111111111'+result.next_treasure_time)
        other +='📣首页宝箱\n'
        other += '开启成功'
        other += '获得金币'+result.data.score_amount+'个\n'
        }
      else{
         if(result.err_no == 9){
        other +='📣首页宝箱\n'
        other += result.err_tips+'\n'
        }else{
        other +='📣首页宝箱\n'
        other +="不在开宝箱时间\n"
           }
    }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  }  


function openfarmbox() {
//$.log(farmkey)
return new Promise((resolve, reject) => {
//$.log(farmkey)
  let openfarmboxurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/box/open?${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(openfarmboxurl,(error, response, data) =>{
     const result = JSON.parse(data)
        $.log(data)
      if(result.status_code == 0) {
        //$.log(1111)
        other +='📣农场宝箱\n'
        other += "第"+(5-result.data.box_num)+"开启成功"
        other += "还可以开启"+result.data.box_num+"个\n"
        
        }
      if(result.status_code == 5003){
        other +='📣农场宝箱\n'
        other +="已全部开启\n"
           }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  }  
function landwarer() {
return new Promise((resolve, reject) => {
//$.log(farmkey)
  let landwaterurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/land_water?tentimes=0${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(landwaterurl,(error, response, data) =>{
     const result = JSON.parse(data)
        //$.log(data)
       other +='📣农场浇水\n'
      if(result.status_code == '0') {
        other += result.message+'\n'
        other += '💧水滴剩余'+result.data.water+'\n'
        }
      else{
        other +=result.message+'\n'
           }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 
//done 这个离线奖励当宝箱全部开完后，需要进入农场再运行脚本，才能获取离线奖励，应该有一个判定，目前没有找到
//利用浇水激活进农场状态获取离线奖励，目前测试每天离线奖励足够开启农场5个宝箱，不需要做游戏加快生产，具体情况看后期是否需要，再考虑加做除虫，开地，三餐奖励
function double_reward() {
//$.log(farmkey)
return new Promise((resolve, reject) => {
//$.log(farmkey)
  let double_rewardurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/double_reward?watch_ad=1&${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(double_rewardurl,(error, response, data) =>{
     const result = JSON.parse(data)
        $.log(data)
      if(result.status_code == 0) {
        other +='📣农场视频双倍离线奖励\n'
        other += '获得成功\n'
        }else{
          if(result.status_code==5033){
            other += result.message+'\n'
          }else{
        //$.log('8888888'+result.service_time)
        other +='📣农场视频双倍离线奖励\n'
        other +="无离线产量可领取\n"
           }
  }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  }  
function sleepstatus() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let sleepstatusurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/status/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(sleepstatusurl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.err_no == 0) {
          other +='📣查询睡觉状态\n🎉查询'+result.err_tips+'\n'
        
       if(result.data.sleeping == false){
          other +='当前状态:清醒着呢\n'
//$.log('jjjjjjjjjj'+hour)
         if(hour >= 20){
          collect=0 //await sleepstart()
           }else{
            collect=2 //no opreation
             }
            }else{
          other +='当前状态:酣睡中,已睡'+parseInt(result.data.sleep_last_time/3600)+'小时'+parseInt((result.data.sleep_last_time%3600)/60)+'分钟'+parseInt((result.data.sleep_last_time%3600)%60)+'秒\n'
          other +='预计可得金币'+result.data.sleep_unexchanged_score+'\n'
          coins=result.data.sleep_unexchanged_score
         if(result.data.sleep_unexchanged_score == 3600 || parseInt(result.data.sleep_last_time/3600) == 12){ 
//即使没有满足3600也在睡觉12小时后停止，以防封号
         collect =1 //collect coins&sleepstop
          }else{
         collect =2
}
  
           }
     }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 
function sleepstart() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let sleepstarturl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/start/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sleepstarturl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.err_no == 0) {
          other +='📣开始睡觉\n该睡觉了，开始睡觉'+result.err_tips+'\n'
  
}     else if(result.err_no == 1052){
          other +='📣开始睡觉\n'+result.err_tips+'\n'
           }else{
          other += '📣开始睡觉:'+'⚠️异常'
}
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 
function sleepstop() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let sleepstopurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/stop/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sleepstopurl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.err_no == 0) {
          other +='📣停止睡觉\n'+result.err_tips+'\n'
          
}     else if(result.err_no == 1052){
          other += '📣停止睡觉\n'+'还没开始睡觉\n'
           }else{
          other +='📣停止睡觉:'+'\n⚠️异常'
}
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 
function collectcoins(coins) {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let collectcoinsurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/done_task/?_request_from=web&device_platform=undefined&${signurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
    body :JSON.stringify({score_amount: coins}),

}

   $.post(collectcoinsurl,(error, response, data) =>{
     const result = JSON.parse(data)
       $.log(data)
      if(result.err_no == 0) {
          other +='📣收取金币\n'+result.err_tips+'     获得金币:'+coins
          
}     else{
          other +='📣收取金币:'+'\n⚠️异常:'+result.err_tips+''
}
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

async function showmsg(){
      $.msg(jsname, "", other)
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
