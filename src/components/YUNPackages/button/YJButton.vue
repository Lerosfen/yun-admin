<template>
  <div class="yj-button " :class='[type, size]' @click="clickBtn" :disabled="buttonDisabled">
    <span>
            <slot>新增 </slot>
    </span>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'YjButton',
    props: {
      type: {
        require: true,
        type: String,
        default: 'yellowBtn',
      },
      size: {
        require: true,
        type: String,
        default: 'normal',
      },
      disabled: Boolean,
    },
    methods: {
      clickBtn() {
        this.$emit('yjClick');
      },
      buttonDisabled() {
        console.log('0-0-09-89078967856877457546436');
        console.log(this.disabled);
        return this.disabled;
      }
    }
  };
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/css/base.less";

  .normalSize() {
    width: 87px;
    height: 47px;
  }

  .normal {
    width: 87px;
    height: 47px;
    font-size: 15px;
  }

  .small {
    width: 60px;
    height: 35px;
    font-size: 12px;
  }

  .lg {
    width: 140px;
    height: 47px;
    font-size: 15px;
  }

  .button-normal() {
    display: inline-block;
    position: relative;
    color: @iceYellow;
    font-family: "Microsoft YaHei", sans-serif;
    letter-spacing: 1px;
    font-weight: bold;
    cursor: pointer;
  }

  .yj-button {
    .button-normal();
    span {
      .box-hor-ver-center();
      .user-select-none();
    }
    &:active {
      opacity: 0.7;
    }
  }

  .yellowBtn {
    background: url("../../../assets/img/dialog/btn1.png") 100% 100% no-repeat;
    background-size: 100% 100%;
  }

  .blueBtn {
    color: @iceBlue;
    background: url("../../../assets/img/dialog/btn2.png") 100% 100% no-repeat;
    background-size: 100% 100%;
  }
</style>
