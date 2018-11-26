<template>
  <form id="submit" @submit.prevent>
    <input
      @input="queryBeer"
      placeholder="Find some beer"
    >
    <div id="search-button-container">
      <ActionButton
        text="I'm feeling drunk"
        :onClickHandler="fetchRandom"
      />
      <ActionButton
        :onClickHandler="toggleFavoriteDisplay"
        :text=" showingFavorites ? 'Show All' : 'Show Favorites' "
      />
    </div>
    <div id="slider-section">
      <ActionButton
        :text="!shouldEnableAbvRange ? 'Disable ABV filter' : 'Enable ABV filter' "
        :onClickHandler="toggleAbvRange"
      />
      <vue-slider
        v-bind="sliderOptions"
        :value.sync="abvRange"
        @drag-end="updateAbvRange"
        :disabled="shouldEnableAbvRange"
      />
    </div>
  </form>
</template>

<script>
import vueSlider from 'vue-slider-component';
import ActionButton from './ActionButton.vue';

const defaultSliderOptions = {
  sliderOptions: {
    height: 8,
    dotSize: 20,
    min: 0,
    max: 100,
    width: '85%',
    show: true,
    tooltip: 'always',
    tooltipDir: ['bottom', 'bottom'],
    piecewise: false,
    style: {
      margin: '0px 0px 30px 10px',
      maxWidth: '90%',
      flexGrow: '1',
    },
    bgStyle: {
      backgroundColor: '#fff',
      boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)',
    },
    sliderStyle: [
      {
        backgroundColor: '#f05b72',
      },
      {
        backgroundColor: '#3498db',
      },
    ],
    tooltipStyle: [
      {
        backgroundColor: '#f05b72',
        borderColor: '#f05b72',
      },
      {
        backgroundColor: '#3498db',
        borderColor: '#3498db',
      },
    ],
    processStyle: {
      backgroundImage: '-webkit-linear-gradient(left, #f05b72, #3498db)',
    },
  },
};

export default {
  name: 'SearchController',
  data() {
    return defaultSliderOptions;
  },
  computed: {
    shouldEnableAbvRange() {
      return this.disableAbvRange;
    },
  },
  components: {
    ActionButton,
    vueSlider,
  },
  props: {
    fetchRandom: {
      type: Function,
      required: true,
    },
    queryBeer: {
      type: Function,
      required: true,
    },
    toggleFavoriteDisplay: {
      type: Function,
      required: true,
    },
    showingFavorites: {
      type: Boolean,
      required: true,
    },
    disableAbvRange: {
      type: Boolean,
      required: true,
    },
    toggleAbvRange: {
      type: Function,
      required: true,
    },
    abvRange: {
      type: Array,
      required: true,
    },
    updateAbvRange: {
      type: Function,
      required: true,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#submit {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#submit > * {
  height: 50px;
  margin-bottom: 10px;
}

#slider-section {
  display: flex;
  flex-direction: row;
  width: 100%;
}

#search-button-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

#search-button-container > button {
  flex: 1;
  margin: 0px 5px;
}

#search-button-container > button:first-child {
  flex: 1;
  margin-left: 0px;
}

#search-button-container > button:last-child {
  flex: 1;
  margin-right: 0px;
}

input {
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
}
</style>
