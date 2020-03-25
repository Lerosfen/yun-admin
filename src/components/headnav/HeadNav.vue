<template>
  <div class="headNav">
    <!--<div class="head-left" v-if='false'>
      <div class="head-btn head-btn-sort">
        <div class="align-center">
          <span class="header-search"></span>
          <span>搜索</span>
        </div>
      </div>
    </div>

     <div class="headNav-logo">
      <div class='logo-img'><img src="../../assets/img/headNav/logo.png" alt=""></div>
      <div class='txt-right'>
        <div class='conf-title'>{{configs}}</div>
        <div class='title-eng'>Big data service platform</div>
      </div>
    </div>
    <div class="head-right">
      <div class="head-btn head-btn-long">
        <div class="align-center">
          <span class="head-user"></span>
          <el-dropdown trigger="click">
            <span class="user-name">{{adminName}}</span>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item @click.native="baseUserInfo">基本资料</el-dropdown-item>
              <el-dropdown-item @click.native="modifyPassword">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class='head-welcome'>欢迎您!</span>
        </div>
      </div>

      <div class="head-btn head-btn-sort">
        <div class="align-center">
              <span>
                  <router-link to="/login">
                <span class="header-close"></span>
              </router-link>
              </span>
          <span>
                  &lt;!&ndash; <router-link to="/login"> &ndash;&gt;
                <span @click='logOut'>退出</span>
              &lt;!&ndash; </router-link> &ndash;&gt;
              </span>
        </div>
      </div>
    </div>
    &lt;!&ndash;//基本资料&ndash;&gt;
    <yj-dialog title="个人中心-基本资料" :visible.sync="baseInfoVisible" :close-on-click-modal="false" width="30%">
      <el-row :gutter="20">
        <el-col :span="15" :offset="4">
          <div class="grid-content bg-purple">
            <el-form :model="userInfo" label-width="100px">
              <el-form-item label="真实姓名" prop="name">
                <div class="input-tpm blue-input">
                  <i class="honer-left"></i>
                  <el-input type="text" v-model="userInfo.name" disabled></el-input>
                  <i class="honer-right"></i>
                </div>
              </el-form-item>
              <el-form-item label="用户名" prop="account">
                <div class="input-tpm blue-input">
                  <i class="honer-left"></i>
                  <el-input type="text" v-model="userInfo.account" disabled></el-input>
                  <i class="honer-right"></i>
                </div>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <div class="input-tpm blue-input">
                  <i class="honer-left"></i>
                  <el-input type="text" v-model="userInfo.phone" disabled></el-input>
                  <i class="honer-right"></i>
                </div>
              </el-form-item>
              <el-form-item label="所属部门" prop="departmentName">
                <div class="input-tpm blue-input">
                  <i class="honer-left"></i>
                  <el-input type="text" v-model="userInfo.departmentName" disabled></el-input>
                  <i class="honer-right"></i>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue-btn" @click="baseInfoVisible=false">关 闭</el-button>
      </div>
    </yj-dialog>
    &lt;!&ndash;//密码修改&ndash;&gt;
    <yj-dialog title="个人中心-密码修改" :visible.sync="passwordVisible" :close-on-click-modal="false" width="30%">
      <el-row :gutter="20">
        <el-col :span="24" :offset="4">
          <div class="grid-content bg-purple">
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px">
              <el-form-item label="原密码" prop="oldPass">
                <div class="input-tpm blue-input">
                  <i class="honer-left"></i>
                  <el-input type="password" v-model="ruleForm2.oldPass" maxlength="30"></el-input>
                  <i class="honer-right"></i>
                </div>
              </el-form-item>
              <el-form-item label="新密码" prop="pass">
                <div class="input-tpm blue-input">
                  <i class="honer-left"></i>
                  <el-input type="password" v-model="ruleForm2.pass" maxlength="30"></el-input>
                  <i class="honer-right"></i>
                </div>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <div class="input-tpm blue-input">
                  <i class="honer-left"></i>
                  <el-input type="password" v-model="ruleForm2.checkPass" maxlength="30"></el-input>
                  <i class="honer-right"></i>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="yellow-btn" type="primary" @click.native="submitForm('ruleForm2')">提 交</el-button>
        <el-button class="blue-btn" @click="passwordVisible=false">关 闭</el-button>

      </div>
    </yj-dialog>-->


    <div class="logo-image">
      <div class="left-logo"></div>
      <div class="logo-title">政法大数据基础平台</div>
      <div class="logo-title-eng">BIG DATA BASIC PLATFORM</div>
      <div class="backContent">
        <Icon type="md-person" color="#fff" :size="18"></Icon>
        <!--<span class="welcome">{{ account }}, 欢迎您</span>-->
        <el-dropdown size="mini" :hide-on-click="false">
          <span class="el-dropdown-link" style="color: #fff;font-size: 12px">
            {{ account }}, 欢迎您<i
            class="el-icon-arrow-down el-icon--right"
          ></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="jump('userDia')"
            >个人中心</el-dropdown-item
            >
            <el-dropdown-item @click.native="jump('password')"
            >修改密码</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <span class="logout" @click="openErrorLoggerPage">退出</span>|
        <Icon type="md-home" color="#fff" :size="18" class="home"></Icon>
        <span class="backto" @click="backToHome">返回门户</span>
      </div>
    </div>
  </div>
</template>

<script>
  // import api from '../../components/api/bigData/indexView';
  import md5 from 'js-md5';

  export default {
    name: 'HeadNav',
    data() {
      let validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'));
        } else {
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        var regx = /^[0-9a-zA-Z_!@#$%^&*]{6,}$/;
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if (!regx.test(value)) {
          callback(new Error('密码必须是至少6位的数字、字母、下划线或特殊字符'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入新密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        account: 'admin',
        adminName: '',
        configs: '',
        passwordVisible: false,
        baseInfoVisible: false,
        userInfo: {
          name: '',
          account: '',
          phone: '',
          // departmentName: '',
        },
        ruleForm2: {
          pass: '',
          checkPass: '',
          oldPass: ''
        },
        rules2: {
          oldPass: [
            { validator: validatePass1, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },

    mounted() {
      this.adminName = sessionStorage.getItem('adminName');
      this.getTitleConfig();

    },
    methods: {
      jump(name) {
        /*
        * 1.1需要验证token 是否过期
        * */
        if (name === 'userDia') {
          let home_url = 'http://192.168.0.12:8089/'
          let suffix = '/#/' + 'personalCenter'
          window.location.href = home_url + suffix
        } else if (name === 'password') {
          let suffix = '/#/' + 'ChangePassword'
          window.location.href = home_url + suffix
        }
      },
      openErrorLoggerPage() {
        window.location.href = 'http://192.168.0.12:8089/';
      },
      backToHome() {
        window.location.href = 'http://192.168.0.12:8089/';
      },
      // 加密
      encrypt(password) {
        //公钥
        let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCcRCS2y6ajKKYurADS07nLmyQBVwOoTr+LACehQIGKE3Pn4S2USUVLmZqw0Kkoib4TPnwFR/v0AF5H7oGORq4hTwNUJmDLduHOFkP+1b0R2Dd/cfR+MH/7TrMmmv+sSUnr1uraLCTLcITcaDIX/GY/8IdI3H62gh0o6tbEGZICvwIDAQAB'; // 从后台获取公钥，这里省略，直接赋值
        let encryptor = new JSEncrypt();//新疆JsEncrypt对象
        encryptor.setPublicKey(publicKey);//设置公钥
        let rsaPassWord = encryptor.encrypt(password);
        return rsaPassWord;
      },


      // 获取标题配置
      getTitleConfig() {
        /* var self = this;
         api.getTitle({ configKey: 'system_title' })
           .then(res => {
             console.log('cccc', res.data);
             if (res.code == 'code_200') {
               self.configs = res.data.configValue;
             } else {
               this.$message({
                 type: 'error',
                 message: res.msg,
               });
             }
           });*/
      },
      //点击修改密码
      modifyPassword() {
        this.passwordVisible = true;
      },
      //提交密码
      submitForm(formName) {
        /* this.$refs[formName].validate((valid) => {
           if (valid) {
             // 加密
             var pwd = this.ruleForm2.oldPass;
             var nPwd = this.ruleForm2.pass;
             api.modifyUserPassword({
               password: this.encrypt(pwd),
               newpassword: this.encrypt(nPwd)
             })
               .then((res) => {
                 if (res.code == 'code_201') {
                   this.passwordVisible = false;
                   this.$message({
                     type: 'success',
                     message: res.msg,
                   });
                 } else {
                   this.$message({
                     type: 'error',
                     message: res.msg,
                   });
                 }
               });
           } else {
             return false;
           }
         });*/
      },

      //基本资料
      baseUserInfo() {
        this.baseInfoVisible = true;
        /*api.getUserInfo({
          id: '1008611'
        })
          .then((res) => {
            if (res.code == 'code_200') {
              this.userInfo = res.data;
              api.getDepartmentName({
                id: res.data.departmentId
              })
                .then((val) => {
                  console.log(val.data.departmentName);
                  console.log(this.userInfo);
                  this.$set(this.userInfo, 'departmentName', val.data.departmentName);
                });
            }

          });*/

      },
      // 退出
      logOut() {
        this.$router.push({ path: '/login', });
        sessionStorage['token'] = '';
      }
    },
    watch: {
      passwordVisible(isShow) {
        if (!isShow) {
          this.$refs.ruleForm2.resetFields();
        }
      }
    }
  };
</script>
<style lang="less">
  @import "../../assets/css/common.less";
  .el-dropdown-menu {
    border: none !important;
    background-color:#fff !important;
    color: #0f100f !important;
    width: 155px !important;
    margin-left: 0 !important;
  }
  .el-dropdown-menu__item {
    color: #606266 !important;
  }
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #ecf5ff !important;
    color: #66b1ff !important;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #ecf5ff !important;
    color: #66b1ff !important;
  }
  .head-user {
    width: 30px;
    height: 30px;
    background: url(../../assets/img/icon/user.png) 100% 100% no-repeat;
    margin-left: 45px;
  }

  .header-search {
    width: 30px;
    height: 30px;
    background: url(../../assets/img/icon/search.png) 100% 100% no-repeat;
    margin-left: 25px;
  }

  .header-close {
    width: 30px;
    height: 30px;
    background: url(../../assets/img/icon/close.png) 100% 100% no-repeat;
    margin-left: 25px;
  }

  .align-center {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .align-center span {
    display: inline-block;
    margin-right: 6px;
  }

  .user-name {
    color: #CCA81E;
    font-family: "Agency FB";
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
    /* width: 98px; */
    font-size: 16px;
    cursor: pointer;
  }

  .headNav {
    height: 80px;
    position: relative;
    /*padding-bottom: 40px;*/
  }

  .headNav-logo {
    width: 500px;
    height: 60px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    cursor: pointer;
    background: url('../../assets/img/headNav/titleBorder.png') no-repeat;
    background-size: 100% 100%;

    .logo-img {
      display: inline-block;
      width: 165px;
      height: 30px;
      position: absolute;
      left: 10%;
      top: 8px;

      > img {
        width: 165px;
        height: 30px;
      }
    }

    .txt-right {
      display: inline-block;
      position: absolute;
      left: 45%;
      top: 9px;
      line-height: 1;

      .conf-title {
        width: 220px;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        color: #04a3ad;
        font-size: 14px;
        font-family: 'Microsoft YaHei';
        letter-spacing: 6px;
      }

      .title-eng {
        color: #04a3ad;
        font-size: 12px;
        font-family: 'Microsoft YaHei';
        opacity: 0.6;
        text-shadow: 0px 0px 8px #04a3ad;
      }
    }
  }

  .head-left {
    position: absolute;
    left: 10%;
    top: 0;
  }

  .head-right {
    position: absolute;
    right: 10%;
    top: 0;
  }

  .head-btn {
    display: flex;
  }

  .head-btn span {
    align-items: center;
    font-size: 16px;
  }

  .head-btn-long {
    display: inline-block;
    background: url("../../assets/img/headNav/longBtn.png") 100% 100% no-repeat;
    width: 255px;
    height: 41px;
  }

  .head-btn-sort {
    display: inline-block;
    background: url("../../assets/img/headNav/sortBtn.png") 100% 100% no-repeat;
    width: 135px;
    height: 41px;
  }

  @media screen and (max-width: 1600px) {
    .headNav-logo {
      position: absolute;
      left: 43%;
      top: 0;
      transform: translateX(-50%);
      cursor: pointer;
    }


    .head-btn-long {
      display: inline-block;
      background: url("../../assets/img/headNav/longBtn.png") 100% 100% no-repeat;
      width: 215px;
      height: 35px;
      background-size: 100% 100%;
    }

    .align-center span {
      display: inline-block;
      margin-right: 7px;
      font-size: 14px;
    }

    .head-user {
      width: 20px;
      height: 20px;
      margin-left: 30px;
      background: url(../../assets/img/icon/user.png) 100% 100% no-repeat;
      background-size: 100%;
    }

    .header-close {
      width: 20px;
      height: 20px;
      background: url(../../assets/img/icon/close.png) 100% 100% no-repeat;
      margin-left: 25px;
      background-size: 100%;
    }

    .header-search {
      width: 20px;
      height: 20px;
      background: url(../../assets/img/icon/search.png) 100% 100% no-repeat;
      margin-left: 25px;
      background-size: 100%;
    }

    .head-btn-sort {
      display: inline-block;
      background: url("../../assets/img/headNav/sortBtn.png") 100% 100% no-repeat;
      width: 125px;
      height: 35px;
      background-size: 100%;
    }

  }

  .grid-content .el-form-item__label {
    color: #616161;
  }

  .el-dropdown-menu {
    border: 1px solid #10d1db;
    background-color: #0f100f;
    text-align: center;
    width: 213px;
    margin-top: 5px;
    margin-left: -133px;
  }

  .el-dropdown-menu__item {
    color: #f8f8f8;
    font-size: 16px;
  }

  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #f8f8f8;
    background-color: #0b2932;
  }

  .el-popper {
    margin-top: 10px !important;
  }

  .el-popper .popper__arrow {
    //display: none;
  }

  .yj-dialog__wrapper .yj-dialog .yj-dialog__body .yj-dialog__header1 {
    padding-left: 50px;
  }

  .logo-image {
    overflow: hidden;
    width: 1920px;
    height: 104px;
    background: url("../../assets/img/headNav/top-bg.png") no-repeat;

    .left-logo {
      float: left;
      width: 50px;
      height: 52px;
      background: url("../../assets/img/headNav/logo-icon.png") no-repeat;
      margin: 23px 0 0 56px;
    }

    .logo-title {
      float: left;
      font-size: 24px;
      font-weight: bold;
      color: rgba(255, 254, 254, 1);
      margin-left: 26px;
      margin-top: 20px;
    }

    .logo-title-eng {
      float: left;
      font-size: 12px;
      font-family: Arial;
      font-weight: 400;
      color: rgba(255, 254, 254, 1);
      margin-top: 61px;
      margin-left: -191px;
    }

    .backContent {
      color: #fff;
      position: absolute;
      right: 3%;
      top: 1%;
      display: flex;
      align-items: center;
      overflow: hidden;

      .welcome {
        margin: 0 8px;
      }

      .logout {
        cursor: pointer;
        color: #e22129;
        margin-right: 10px;

        &:hover {
          text-decoration: underline;
        }
      }

      .home {
        margin-left: 10px;
      }

      .backto {
        cursor: pointer;
        margin: 3px 0 0 5px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
