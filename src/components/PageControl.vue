<template>
  <div class="page-controller-container">
    <ActionButton
      v-if="!showingFavorites"
      text="Favorite All On Screen"
      :onClickHandler="toggleFavoriteOnScreen"
    />
    <div class="page-nav-container">
      <ActionButton
        :onClickHandler="() => changePage(currentPage-1)"
        :disableButton="onFirstPage"
      >
        <template slot="customContent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            v-bind:class="{'svg-hidden': onFirstPage}"
          >
            <path
              d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"
            />
          </svg>
        </template>
      </ActionButton>
      <ActionButton
        v-for="page in displayedPages"
        :key="page"
        :onClickHandler="() => changePage(page)"
        :text="page"
        :style="page === currentPage && activePageStyle"
      />
      <ActionButton
        :onClickHandler="() => changePage(currentPage+1)"
        :disableButton="onLastPage"
      >
        <template slot="customContent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            v-bind:class="{'svg-hidden': onLastPage}"
          >
            <path
              d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"
            />
          </svg>
        </template>
      </ActionButton>
    </div>
  </div>
</template>

<script>
import ActionButton from './ActionButton.vue';
import { fillRange } from '../helpers';

export default {
  name: 'PageControl',
  components: { ActionButton },
  data() {
    return {
      activePageStyle: {
        backgroundColor: 'grey',
      },
    };
  },
  computed: {
    displayedPages() {
      if (this.currentPage < 5) {
        return this.numOfPages >= 5
          ? fillRange(1, 5)
          : fillRange(1, this.numOfPages);
      }
      return this.currentPage + 2 >= this.numOfPages
        ? fillRange(this.numOfPages - 4, this.numOfPages)
        : fillRange(this.currentPage - 2, this.currentPage + 2);
    },
    onFirstPage() {
      return this.currentPage === 1;
    },
    onLastPage() {
      return this.currentPage === this.numOfPages;
    },
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    numOfPages: {
      type: Number,
      required: true,
    },
    changePage: {
      type: Function,
      required: true,
    },
    toggleFavoriteOnScreen: {
      type: Function,
      required: true,
    },
    showingFavorites: {
      type: Boolean
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-controller-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin: 10px;
}

.page-controller-container > button {
  margin-right: 5px;
}

.page-controller-container > button:last-child {
  margin-right: 0px;
}

svg {
  height: 100%;
  width: 20px;
  margin: 5px;
}

.svg-hidden {
  visibility: hidden;
}

.page-nav-container {
  display: flex;
  flex-direction: row;
  justify-self: end;
}
</style>
