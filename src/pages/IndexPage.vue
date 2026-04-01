<template>
  <q-page padding>
    <!-- Favorites section -->
    <FavoritesPanel v-if="favorites.length > 0" />
    <q-separator v-if="favorites.length > 0" class="q-my-lg" />

    <!-- Other games -->
    <DatePicker v-model="selectedDate" class="q-mb-lg" />
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-else-if="error" class="text-center q-pa-lg text-negative">
      {{ error }}
    </div>
    <div v-else-if="games.length === 0" class="text-center q-pa-lg text-grey-8">
      No games scheduled for this date.
    </div>
    <div v-else-if="otherGames.length > 0" class="row justify-center q-gutter-md">
      <GameCard
        v-for="game in otherGames"
        :key="game.gamePk"
        :game="game"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DatePicker from '../components/DatePicker.vue'
import GameCard from '../components/GameCard.vue'
import FavoritesPanel from '../components/FavoritesPanel.vue'
import { useGameStatus } from '../composables/useGameStatus'
import { useFavorites } from '../composables/useFavorites'

function formatDate(d: Date): string {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}

const selectedDate = ref(formatDate(new Date()))
const dateGetter = computed(() => selectedDate.value)
const { games, loading, error } = useGameStatus(() => dateGetter.value)
const { favorites, isFavorite } = useFavorites()

const otherGames = computed(() => {
  return games.value.filter(
    (g) => !isFavorite(g.teams.away.id) && !isFavorite(g.teams.home.id),
  )
})
</script>
