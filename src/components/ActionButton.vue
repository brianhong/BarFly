<template>
  <button
    :class="buttonClass"
    @click="onClickHandler"
  >
    <slot
      name="customContent"
      class="custom-content"
    >
      <div>{{ text }}</div>
    </slot>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  computed: {
    buttonClass() {
      return {
        'custom-button': !!this.$slots.customContent,
        'button-disabled': this.disableButton,
      };
    },
  },
  props: {
    text: {
      type: [String, Number],
    },
    customContent: {
      type: [String, Object],
      required: false,
      default: null,
    },
    onClickHandler: {
      type: Function,
      default() {
        return () => {};
      },
    },
    disableButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  border: 1px solid black;
}

.button-disabled {
  visibility: hidden;
}

.custom-content {
  width: 100%;
  height: 100%;
}

.custom-button {
  border: none;
}

</style>
