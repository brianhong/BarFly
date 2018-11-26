<template>
  <div class="card">
    <div class="beer-info">
      <FavoriteController
      :id="beer.id"
      :beer="beer"
      :toggleFavorite="toggleFavorite"
      :isFavorited="isFavorited"
    />
      <div class="beer-blurb">
        <p>Beer Name: {{ beer.name }}</p>
        <p>ABV: {{ beer.abv }}</p>
      </div>
      <img :src="beer.image_url" />
    </div>
    <p><b>Description:</b> {{ beer.description }}</p>
  </div>
</template>

<script>
import FavoriteController from "./FavoriteController.vue";

export default {
  name: "BeerCard",
  components: {
    FavoriteController
  },
  props: {
    beer: {
      type: Object,
      required: true
    },
    toggleFavorite: {
      type: Function,
      required: true
    },
    isFavorited: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 5px;
  text-align: left;
}

img {
  height: 100px;
  width: 100px;
  object-fit: contain;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
}

.beer-blurb {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.beer-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
