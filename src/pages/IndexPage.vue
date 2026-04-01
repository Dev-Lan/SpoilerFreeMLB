<template>
  <q-page padding>
    <DatePicker v-model="selectedDate" class="q-mb-lg" />
    <GameList :games="sortedGames" :loading="loading" :error="error" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DatePicker from '../components/DatePicker.vue'
import GameList from '../components/GameList.vue'
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
const { isFavorite } = useFavorites()

const sortedGames = computed(() => {
  return [...games.value].sort((a, b) => {
    const aFav = isFavorite(a.teams.away.id) || isFavorite(a.teams.home.id)
    const bFav = isFavorite(b.teams.away.id) || isFavorite(b.teams.home.id)
    if (aFav && !bFav) return -1
    if (!aFav && bFav) return 1
    return 0
  })
})
</script>
