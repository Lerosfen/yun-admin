<!--
dialog使用说明
使用之处添加@click="openMask"；
  <Dailog v-model="sendVal" type="confirm" title="我是标题"
  v-on:cancel="clickCancel()"
  @danger="clickDanger()"
  @confirm="clickConfirm()" dangerText="Delete">
  </Dailog>
-->
<template>
  <div class="dialog" v-show="showMask">
    <div class="dialog-container">
      <div class="dialog_top">
        <img src="../../../assets/img/dialog/top_bg.png"/>
      </div>
      <div class="dialog_middle" ref="dialog_middle">
        <div class="dialog-title"><img src="../../../assets/img/dialog/arrows.png"/>&nbsp;{{title}}
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="btns">
          <div v-if="type == 'confirm'" class="confirm-btn" @click="confirmBtn">
            {{confirmText}}
          </div>
          <div v-if="type == 'confirm'" class="cancel-btn" @click="closeBtn">
            {{cancelText}}
          </div>
        </div>
      </div>
      <div class="dialog_bottom">
        <img src="../../../assets/img/dialog/bottom_bg.png"/>
      </div>
      <div class="dialog_close"><i class="el-icon-circle-close-outline close_M" @click="close"></i></div>

    </div>

  </div>
</template>
<script>
  /* eslint-disable */
  export default {
    name: 'Dialog',
    props: {
      value: {},
      // 类型包括 defalut 默认， danger 危险， confirm 确认，
      type: {
        type: String,
        default: 'default'
      },
      content: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确认'
      },
      D_height: {
        type: String,
        default: 400
      },
    },
    data() {
      return {
        showMask: false,
      }
    },
    methods: {

      closeMask() {
        this.showMask = false;
      },
      closeBtn() {
        this.$emit('cancel');
        this.closeMask();
      },
      close() {
        this.$emit('close');
        this.closeMask();
      },
      confirmBtn() {
        this.$emit('confirm');
        this.closeMask();
      }
    },
    mounted() {
      this.showMask = this.value;
      this.$refs.dialog_middle.style.height = this.D_height + 'px';
    },
    watch: {
      value(newVal) {
        this.showMask = newVal;
      },
      showMask(val) {
        this.$emit('input', val);
      }
    },
  }
</script>
<style lang="less" scoped>
  .dialog {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;

    .dialog-container {
      /*width: 600px;*/
      /*height: 380px;*/
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 45%;
      .dialog_close {
        width: 100%;
        text-align: center;
        font-size: 44px;
        color: #00e5e9;
      }
      .dialog_top {
        line-height: 0;
        margin-bottom: -1px;
      }
      .dialog_middle {
        /*width: 100%;*/
        /*height: 400px;*/
        background-image: url("../../../assets/img/dialog/middle_bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: relative;
        .dialog-title {
          width: 100%;
          height: 60px;
          text-align: left;
          padding-left: 58px;
          font-size: 18px;
          color: #01c6ca;
          /*font-weight: 600;*/
          /*padding: 16px 50px 0 20px;*/
          box-sizing: border-box;
          img {
            width: 24px;
          }
        }
        .close-btn {
          position: absolute;
          bottom: 0;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 18px;
          cursor: pointer;
          &:hover {
            font-weight: 600;
          }
        }
      }
      .dialog_bottom {
        margin-top: -1px;
      }
      img {
        width: 100%;
      }

      .content {
        color: #797979;
        line-height: 26px;
        padding: 0 58px;
        box-sizing: border-box;
      }
      .inp {
        margin: 10px 0 0 20px;
        width: 200px;
        height: 40px;
        padding-left: 4px;
        border-radius: 4px;
        border: none;
        background: #efefef;
        outline: none;
        &:focus {
          border: 1px solid #509EE3;
        }
      }
      .btns {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: center;
        padding: 0 16px;
        box-sizing: border-box;
        & > div {
          display: inline-block;
          height: 40px;
          line-height: 34px;
          padding: 0 26px;
          color: #509EE3;
          border-radius: 8px;
          margin: 0 15px;
          cursor: pointer;
        }
        .confirm-btn {
          background: url("../../../assets/img/dialog/btn1.png") 100% 100% no-repeat;
          color: #f7d627;
        }
        .cancel-btn {
          background: url("../../../assets/img/dialog/btn2.png") 100% 100% no-repeat;
        }
      }
      .close_M {
        cursor: pointer;
      }
    }
  }
</style>
