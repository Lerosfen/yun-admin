<template>
  <div>
    <div class="yj-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick" close-on-click-modal="true">
      <div class="yj-dialog"
           ref="dialog" :style="style">
      <div class="yj-dialog__header">
        <img src="../../../assets/img/dialog/top_bg.png"/>
      </div>
        <div class="yj-dialog__body" v-if="rendered">
          <!--头部-->
          <div class="yj-dialog__header1">
            <slot name="title">
              <span class="yj-dialog__title">{{ title }}</span>
            </slot>
          </div>
          <!--中间内容-->
          <div class="dialog-middle">
            <slot></slot>
          </div>

          <!--底部-->
          <div class="yj-dialog__bottom" v-if="$slots.footer">

            <div class="btns">
              <div class="el-dialog__footer" v-if="$slots.footer">
                <slot name="footer"></slot>
              </div>
              <!--<el-button class="yellow-btn" @click="confirmBtn">-->
               <!--确认-->
              <!--</el-button>-->
              <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
              <!--<el-button  class="cancel-btn" @click="handleClose">-->
                <!--取消-->
              <!--</el-button>-->
            </div>
          </div>
        </div>
        <div class="yj-dialog__footer">
          <img src="../../../assets/img/dialog/bottom_bg.png"/>
        </div>
        <!--//❌关闭-->
       <!-- <div
          type="button"
          class="yj-dialog__headerbtn"
          aria-label="Close"
          v-if="showClose"
          @click="handleClose">
          <i class="el-dialog__close el-icon el-icon-circle-close-outline"></i>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import Popup from 'element-ui/src/utils/popup';
  import Migrating from 'element-ui/src/mixins/migrating';
  import emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'YjDialog',

    mixins: [Popup, emitter, Migrating],

    props: {
      title: {
        type: String,
        default: ''
      },

      modal: {
        type: Boolean,
        default: true
      },

      modalAppendToBody: {
        type: Boolean,
        default: true
      },

      appendToBody: {
        type: Boolean,
        default: false
      },

      lockScroll: {
        type: Boolean,
        default: true
      },

      closeOnClickModal: {
        type: Boolean,
        default: true
      },

      closeOnPressEscape: {
        type: Boolean,
        default: true
      },

      showClose: {
        type: Boolean,
        default: true
      },

      width: {
        type: String,
        require:false,
        default: '60%',
      },

      fullscreen: Boolean,

      customClass: {
        type: String,
        default: ''
      },

      top: {
        type: String,
        default: '15vh'
      },
      beforeClose: Function,
      center: {
        type: Boolean,
        default: false
      },
      callback: Function,
    },

    data() {
      return {
        closed: false
      };
    },

    watch: {
      visible(val) {
        if (val) {
          this.closed = false;
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            // this.$refs.dialog.scrollTop = 0;
          });
          if (this.appendToBody) {
            document.body.appendChild(this.$el);
          }
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper);
          if (!this.closed) this.$emit('close');
        }
      }
    },

    computed: {
      style() {
        let style = {};
        if (this.width) {
          style.width = this.width;
        }
        return style;
      }
    },

    methods: {
      getMigratingConfig() {
        return {
          props: {
            'size': 'size is removed.'
          }
        };
      },
      handleWrapperClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(this.hide);
        } else {
          this.hide();
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.$emit('update:visible', false);
          this.$emit('close');
          this.closed = true;
        }
      },
      updatePopper() {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        this.broadcast('ElDropdownMenu', 'updatePopper');
      },
      afterLeave() {
        this.$emit('closed');
      },
      closeBtn(evt) {
        console.log('pouopyiup');
        console.log(evt);
        this.$emit('cancel',evt);
        // this.closed = true;
      },
    },

    mounted() {
      if (this.visible) {
        this.rendered = true;
        this.open();
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      }
    },

    destroyed() {
      // if appendToBody is true, remove DOM node after destroy
      if (this.appendToBody && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  };
</script>


<style lang="less" scoped>
  .yj-dialog__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    /*z-index: 9999;*/
    .yj-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      /*width: 35%;*/
      .yj-dialog__header {
        margin-bottom: -5px;
        img{
          width: 100%;
        }
        /*padding: 29px 20px;*/
        /*background: url("../../../assets/img/dialog/top_bg.png") 100% 100% no-repeat;*/
      }
      .yj-dialog__body {
        padding-bottom: 60px;
        width: 100%;
        background-image: url("../../../assets/img/dialog/middle_bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        .yj-dialog__header1 {
          padding: 5px 0 10px 70px;

        }
        .dialog-middle{
          padding: 0 80px ;
        }
        .yj-dialog__title {
          line-height: 24px;
          font-size: 16px;
          color: #03fdfe
        }

        .yj-dialog__bottom {
          .btns {
            width: 100%;
            position: absolute;
            bottom: 85px;
            text-align: center;
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
              border: none;
              padding-top: 16px;
            }
            .cancel-btn {
              color: #509EE3;
              border: none;
              width: 82px;
              padding-top: 16px;
              line-height: 20px;
              background: url("../../../assets/img/dialog/btn2.png") 100% 100% no-repeat;
            }
          }
        }
      }

      .yj-dialog__footer {
        margin-top: -1px;
        img{
          width: 100%;
        }
      }
      .yj-dialog__headerbtn {
        position: absolute;
        bottom: -50px;
        width: 100%;
        text-align: center;
        color: #03fdfe;
        font-size: 37px;
      }
    }


    .dialog-fade-enter-active {
      -webkit-animation: dialog-fade-in .3s;
      animation: dialog-fade-in .3s
    }

    .dialog-fade-leave-active {
      -webkit-animation: dialog-fade-out .3s;
      animation: dialog-fade-out .3s
    }

    @-webkit-keyframes dialog-fade-in {
      0% {
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
        opacity: 0
      }
      100% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        opacity: 1
      }
    }

    @keyframes dialog-fade-in {
      0% {
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
        opacity: 0
      }
      100% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        opacity: 1
      }
    }

    @-webkit-keyframes dialog-fade-out {
      0% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        opacity: 1
      }
      100% {
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
        opacity: 0
      }
    }

    @keyframes dialog-fade-out {
      0% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        opacity: 1
      }
      100% {
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
        opacity: 0
      }
    }
  }

</style>
