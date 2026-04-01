<template>
  <q-card flat bordered class="game-card" style="position: relative;">
    <q-chip
      v-if="dateLabel"
      dense
      size="sm"
      color="grey-3"
      text-color="dark"
      class="date-chip"
    >
      {{ dateLabel }}
    </q-chip>
    <q-card-section class="row items-center no-wrap q-pa-md">
      <!-- Away team -->
      <div class="col team-col text-center">
        <q-btn
          flat
          round
          dense
          :icon="isFavorite(game.teams.away.id) ? 'star' : 'star_border'"
          :color="isFavorite(game.teams.away.id) ? 'amber' : 'grey-7'"
          size="xs"
          class="q-mb-xs"
          @click.stop="toggleFavorite(game.teams.away.id)"
        />
        <div>
          <img
            :src="teamLogoUrl(game.teams.away.id)"
            :alt="game.teams.away.name"
            class="team-logo"
          />
        </div>
        <div class="text-caption team-name">
          {{ getTeam(game.teams.away.id)?.abbreviation ?? game.teams.away.name }}
        </div>
      </div>

      <!-- Status -->
      <div class="col-auto status-col text-center q-px-md">
        <q-badge
          :color="statusColor"
          :label="statusLabel"
          class="status-badge"
        />
      </div>

      <!-- Home team -->
      <div class="col team-col text-center">
        <q-btn
          flat
          round
          dense
          :icon="isFavorite(game.teams.home.id) ? 'star' : 'star_border'"
          :color="isFavorite(game.teams.home.id) ? 'amber' : 'grey-7'"
          size="xs"
          class="q-mb-xs"
          @click.stop="toggleFavorite(game.teams.home.id)"
        />
        <div>
          <img
            :src="teamLogoUrl(game.teams.home.id)"
            :alt="game.teams.home.name"
            class="team-logo"
          />
        </div>
        <div class="text-caption team-name">
          {{ getTeam(game.teams.home.id)?.abbreviation ?? game.teams.home.name }}
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="game.venue" class="q-pt-none text-center">
      <div class="text-caption text-grey-8">{{ game.venue }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SanitizedGame } from '../api/types'
import { teamLogoUrl } from '../api/mlb'
import { useFavorites } from '../composables/useFavorites'
import { useTeams } from '../composables/useTeams'

const props = defineProps<{
  game: SanitizedGame
  dateLabel?: string
}>()

const { isFavorite, toggleFavorite } = useFavorites()
const { getTeam } = useTeams()

const statusLabel = computed(() => {
  const g = props.game
  const state = g.status.abstractGameState
  const detail = g.status.detailedState

  if (state === 'Final') {
    if (detail === 'Postponed') return 'Postponed'
    if (detail === 'Suspended') return 'Suspended'
    return 'Final'
  }

  if (state === 'Live') {
    if (detail.startsWith('Delayed')) return detail
    if (g.inning) {
      const half = g.inning.isTopInning ? 'Top' : 'Bot'
      return `${half} ${g.inning.ordinal}`
    }
    return 'Live'
  }

  // Preview / Scheduled
  if (g.status.startTimeTBD) return 'TBD'
  return new Date(g.gameDate).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
})

const statusColor = computed(() => {
  const state = props.game.status.abstractGameState
  if (state === 'Live') return 'green'
  if (state === 'Final') return 'grey-7'
  return 'blue-7'
})
</script>

<style scoped>
.game-card {
  max-width: 340px;
  width: 100%;
}
.date-chip {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
}
.team-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.team-name {
  font-weight: 600;
  font-size: 0.85rem;
}
.team-col {
  min-width: 80px;
}
.status-badge {
  font-size: 0.85rem;
  padding: 4px 12px;
}
</style>
