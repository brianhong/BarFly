<template>
  <div id="app">
    <img
      id ="logo"
      alt="Logo"
      src="./assets/logo.png"
      :class="{loading: loading}"
    >
    <SearchController
      :fetchRandom="fetchRandomBeers"
      :queryBeer="querySpecificBeer"
      :toggleFavoriteDisplay="toggleFavoriteDisplay"
      :showingFavorites="showingFavorites"
      :disableAbvRange="disableAbvRange"
      :toggleAbvRange="toggleAbvRange"
      :abvRange="abvRange"
      :updateAbvRange="updateAbvRange"
    />
    <div v-if="displayableBeers.length">
      <PageControl
        :currentPage="pageNumber"
        :numOfPages="numOfPages"
        :changePage="changePage"
        :toggleFavoriteOnScreen="toggleFavoriteOnScreen"
        :showingFavorites="showingFavorites"
      />
      <BeerCard
        v-for="beer in displayableBeers"
        :key="beer.id"
        :beer="beer"
        :toggleFavorite="toggleFavorite"
        :isFavorited="favoritedIds.includes(beer.id)"
      />
      <PageControl
        :currentPage="pageNumber"
        :numOfPages="numOfPages"
        :changePage="changePage"
        :toggleFavoriteOnScreen="toggleFavoriteOnScreen"
        :showingFavorites="showingFavorites"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { flattenMixedArray } from './helpers';
import SearchController from './components/SearchController.vue';
import BeerCard from './components/BeerCard.vue';
import PageControl from './components/PageControl.vue';

const Promise = require('bluebird');
const debounce = require('lodash.debounce');

export default {
  name: 'app',
  data() {
    return {
      loading: false,
      beers: [],
      favorited: [],
      favoritedIds: [],
      showingFavorites: false,
      pageNumber: 1,
      cachedPageNumber: null,
      maxSize: 6,
      abvRange: [0, 100],
      disableAbvRange: true,
    };
  },
  components: {
    SearchController,
    BeerCard,
    PageControl,
  },
  computed: {
    displayableBeers() {
      const start = (this.pageNumber - 1) * this.maxSize;


      const end = start + this.maxSize;

      return this.showingFavorites
        ? this.favorited.slice(start, end)
        : this.beers.slice(start, end);
    },
    numOfPages() {
      return this.showingFavorites
        ? Math.ceil(this.favorited.length / this.maxSize)
        : Math.ceil(this.beers.length / this.maxSize);
    },
  },
  methods: {
    // Functions related to retrieving and parsing API data
    async parseApiData(arrayOfResults, isGettingRandom = false) {
      const processedBeerIds = [];
      const dupeIds = [];
      let newBeerData = [];

      arrayOfResults.forEach((resultObj) => {
        const beerData = resultObj;
        const { id } = beerData;

        if (isGettingRandom && processedBeerIds.includes(id)) {
          dupeIds.push(id);
        }

        if (!processedBeerIds.includes(id)) {
          processedBeerIds.push(id);
          newBeerData.push(beerData);
        }
      });

      if (isGettingRandom && dupeIds.length) {
        const nonDupeBeers = await this.replaceDuplicates(
          dupeIds,
          dupeIds.length,
        );

        const flattenedNonDupeBeers = flattenMixedArray(nonDupeBeers);
        newBeerData = newBeerData.concat(flattenedNonDupeBeers);
      }

      this.beers = newBeerData;
      this.pageNumber = 1;
      this.cachedPageNumber = null;
      this.loading = false;
    },

    fetchSomeBeers() {
      const bigPayloadRoute = 'https://api.punkapi.com/v2/beers?per_page=80';

      this.loading = true;
      axios.get(bigPayloadRoute).then((res) => {
        this.parseApiData(res.data, false);
      });
    },

    fetchRandomBeers() {
      const randomRoute = 'https://api.punkapi.com/v2/beers/random';
      const randomBeerRequests = [];

      for (let i = 0; i < this.maxSize; i += 1) {
        randomBeerRequests.push(axios.get(randomRoute));
      }

      this.loading = true;
      Promise.mapSeries(randomBeerRequests, request => request).then(
        (arrayOfResults) => {
          const parsedResultsArray = arrayOfResults.map(
            result => result.data[0],
          );
          return this.parseApiData(parsedResultsArray, true);
        },
      );
    },

    replaceDuplicates(arrayOfDuplicates, numOfAttempts) {
      const apiRandomRoute = 'https://api.punkapi.com/v2/beers/random';

      const retryAttempts = Promise.map([...Array(numOfAttempts)], () => axios
        .get(apiRandomRoute)
        .then(res => res.data[0])
        .then(
          beerData => (arrayOfDuplicates.includes(beerData.id)
            ? this.replaceDuplicates([...arrayOfDuplicates, beerData.id], 1)
            : beerData),
        ));

      return Promise.all(retryAttempts).then(res => res);
    },

    querySpecificBeer: debounce(function (event) {
      const beerNameQuery = event.target.value === ' ' ? '_' : event.target.value;

      const apiBase = 'https://api.punkapi.com/v2/beers?';

      const queryArgs = {
        beer_name: beerNameQuery,
      };

      if (!this.disableAbvRange) {
        const [abvGt, abvLt] = this.abvRange;
        Object.assign(queryArgs, {
          abv_gt: abvGt,
          abv_lt: abvLt,
        });
      }

      this.loading = true;
      axios.get(apiBase, beerNameQuery && { params: queryArgs }).then((res) => {
        this.parseApiData(res.data, false);
      });
    }, 500),

    changePage(page) {
      if (page >= 1 && page <= this.numOfPages) {
        this.pageNumber = page;
      }
    },

    // Functions related to setting ABV params
    toggleAbvRange() {
      this.disableAbvRange = !this.disableAbvRange;
    },

    updateAbvRange(event) {
      this.abvRange = event.getValue();
    },

    // Functions related to favoriting beers
    toggleFavoriteDisplay() {
      this.showingFavorites = !this.showingFavorites;
    },

    toggleFavorite(targetBeer) {
      const { id: targetId } = targetBeer;
      if (this.favoritedIds.includes(targetId)) {
        this.favorited = this.favorited.filter(beer => beer.id !== targetId);
        this.favoritedIds = this.favoritedIds.filter(id => id !== targetId);
      } else {
        this.favorited = [...this.favorited, targetBeer];
        this.favoritedIds = [...this.favoritedIds, targetId];
      }
    },

    toggleFavoriteOnScreen() {
      const currentUnfavoritedBeers = this.displayableBeers.filter(({ id }) => !this.favoritedIds.includes(id));
      const currentUnfavoritedIds = currentUnfavoritedBeers.map(({ id }) => id);

      this.favorited = this.favorited.concat(currentUnfavoritedBeers);
      this.favoritedIds = this.favoritedIds.concat(currentUnfavoritedIds);
    },
  },

  mounted() {
    this.fetchSomeBeers();
  },

  watch: {
    displayableBeers() {
      if (this.showingFavorites && !this.cachedPageNumber) {
        this.cachedPageNumber = this.pageNumber;
        this.pageNumber = 1;
      }

      if (!this.showingFavorites && this.cachedPageNumber) {
        this.pageNumber = this.cachedPageNumber;
        this.cachedPageNumber = null;
      }
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}

#logo {
  height: 200px;
  width: 200px;
  margin-bottom: 30px;
}

.loading {
  animation-name: spin;
  animation-duration: 4000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
