/*
 * 配置编译环境和线上环境之间的切换
 * baseUrl: 域名地址
*/
import axios from 'axios'

if (process.env.NODE_ENV == 'development') {  //开发
  axios.get('./static/serverconfig.json').then((result) => {
    sessionStorage.setItem("ApiUrl",result.data.ApiUrl);
  }).catch((error) => {
    console.log(error)
  });
} else if (process.env.NODE_ENV == 'production') {  //线上
  // sessionStorage.setItem("ApiUrl")
} else if (process.env.NODE_ENV == 'testing') {  //测试
  axios.get('./static/serverconfig.json').then((result) => {
    sessionStorage.setItem("ApiUrl", result.data.TestUrl);
  }).catch((error) => {
    console.log(error)
  });

}


