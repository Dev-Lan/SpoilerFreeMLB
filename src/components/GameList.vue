<template>
  <div class="game-list">
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-else-if="error" class="text-center q-pa-lg text-negative">
      {{ error }}
    </div>
    <div v-else-if="games.length === 0" class="text-center q-pa-lg text-grey-6">
      No games scheduled for this date.
    </div>
    <div v-else class="row justify-center q-gutter-md">
      <GameCard
        v-for="game in games"
        :key="game.gamePk"
        :game="game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SanitizedGame } from '../api/types'
import GameCard from './GameCard.vue'

defineProps<{
  games: SanitizedGame[]
  loading: boolean
  error: string | null
}>()
</script>
