<template>
  <q-page padding>
    <!-- Favorites section -->
    <FavoritesPanel v-if="favorites.length > 0" class="q-mb-lg" />

    <!-- Other games -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-else-if="error" class="text-center q-pa-lg text-negative">
      {{ error }}
    </div>
    <div v-else-if="games.length === 0" class="text-center q-pa-lg text-grey-8">
      No games scheduled for today.
    </div>
    <template v-else>
      <div class="row justify-center q-gutter-sm q-mb-md">
        <q-btn
          v-for="opt in filterOptions"
          :key="opt.value"
          :label="opt.label"
          no-caps
          rounded
          :outline="activeFilter !== opt.value"
          :unelevated="activeFilter === opt.value"
          :style="activeFilter === opt.value
            ? { backgroundColor: headerColor, color: 'white' }
            : { borderColor: headerColor, color: headerColor }"
          @click="activeFilter = opt.value"
        />
      </div>
      <div v-if="filteredGames.length > 0" class="row justify-center q-gutter-md">
        <GameCard
          v-for="game in filteredGames"
          :key="game.gamePk"
          :game="game"
        />
      </div>
      <div v-else class="text-center q-pa-lg text-grey-8">
        No {{ activeFilter }} games.
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import GameCard from '../components/GameCard.vue'
import FavoritesPanel from '../components/FavoritesPanel.vue'
import { useGameStatus } from '../composables/useGameStatus'
import { useFavorites } from '../composables/useFavorites'
import type { SanitizedGame } from '../api/types'

type Filter = 'in progress' | 'upcoming' | 'completed'

function formatDate(d: Date): string {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}

function gameFilter(g: SanitizedGame): Filter {
  if (g.status.abstractGameState === 'Live') return 'in progress'
  if (g.status.abstractGameState === 'Final') return 'completed'
  return 'upcoming'
}

const today = formatDate(new Date())
const { games, loading, error } = useGameStatus(() => today)
const { favorites, isFavorite, headerColor } = useFavorites()

const otherGames = computed(() =>
  games.value.filter(
    (g) => !isFavorite(g.teams.away.id) && !isFavorite(g.teams.home.id),
  ),
)

const counts = computed(() => {
  const c = { 'in progress': 0, upcoming: 0, completed: 0 }
  for (const g of otherGames.value) {
    c[gameFilter(g)]++
  }
  return c
})

const activeFilter = ref<Filter>('in progress')

// Auto-select the first non-empty tab
const initialFilter = computed<Filter>(() => {
  if (counts.value['in progress'] > 0) return 'in progress'
  if (counts.value['upcoming'] > 0) return 'upcoming'
  return 'completed'
})

// Set initial once games load
watch(() => otherGames.value.length, (len) => {
  if (len > 0) activeFilter.value = initialFilter.value
}, { immediate: true })

const filterOptions = computed(() => [
  { label: `In Progress (${counts.value['in progress']})`, value: 'in progress' as Filter },
  { label: `Upcoming (${counts.value['upcoming']})`, value: 'upcoming' as Filter },
  { label: `Completed (${counts.value['completed']})`, value: 'completed' as Filter },
])

const filteredGames = computed(() =>
  otherGames.value.filter((g) => gameFilter(g) === activeFilter.value),
)
</script>
