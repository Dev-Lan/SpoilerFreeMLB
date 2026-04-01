<template>
  <q-card flat bordered :class="['game-card', { 'game-card--pinned': pinned }]">
    <q-card-section class="row items-center no-wrap q-pa-md">
      <!-- Away team -->
      <div
        class="col team-col text-center"
        @mouseenter="hoverAway = true"
        @mouseleave="hoverAway = false"
        @click.stop="toggleFavorite(game.teams.away.id)"
      >
        <div class="star-wrapper" :class="starClasses(game.teams.away.id, hoverAway)">
          <q-icon
            :name="isFavorite(game.teams.away.id) ? 'star' : 'star_border'"
            :color="isFavorite(game.teams.away.id) ? 'amber' : 'grey-7'"
          />
        </div>
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
        <div
          v-if="dateLabel && game.status.abstractGameState !== 'Live'"
          class="text-caption text-grey-8 q-mb-xs"
        >
          {{ dateLabel }}
        </div>
        <q-badge
          :color="statusColor"
          :label="statusLabel"
          class="status-badge"
        />
      </div>

      <!-- Home team -->
      <div
        class="col team-col text-center"
        @mouseenter="hoverHome = true"
        @mouseleave="hoverHome = false"
        @click.stop="toggleFavorite(game.teams.home.id)"
      >
        <div class="star-wrapper" :class="starClasses(game.teams.home.id, hoverHome)">
          <q-icon
            :name="isFavorite(game.teams.home.id) ? 'star' : 'star_border'"
            :color="isFavorite(game.teams.home.id) ? 'amber' : 'grey-7'"
          />
        </div>
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
import { computed, ref } from 'vue'
import type { SanitizedGame } from '../api/types'
import { teamLogoUrl } from '../api/mlb'
import { useFavorites } from '../composables/useFavorites'
import { useTeams } from '../composables/useTeams'

const props = defineProps<{
  game: SanitizedGame
  dateLabel?: string
  pinned?: boolean
}>()

const { isFavorite, toggleFavorite } = useFavorites()
const { getTeam } = useTeams()

const hoverAway = ref(false)
const hoverHome = ref(false)

function starClasses(teamId: number, hovering: boolean) {
  const fav = isFavorite(teamId)
  return {
    'star-visible': fav || hovering,
    'star-enlarged': hovering,
  }
}

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
      if (g.inning.current >= 9) return '9th'
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
.game-card--pinned {
  max-width: 420px;
}
.game-card--pinned .team-logo {
  width: 64px;
  height: 64px;
}
.game-card--pinned .team-name {
  font-size: 1rem;
}
.game-card--pinned .status-badge {
  font-size: 1rem;
  padding: 6px 16px;
}
.team-col {
  min-width: 80px;
  cursor: pointer;
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
.star-wrapper {
  height: 20px;
  margin-bottom: 2px;
  font-size: 14px;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.star-visible {
  opacity: 1;
  transform: scale(1);
}
.star-enlarged {
  opacity: 1;
  transform: scale(1.4);
}
.game-card:hover .star-wrapper:not(.star-visible) {
  opacity: 0.5;
  transform: scale(1);
}
.status-badge {
  font-size: 0.85rem;
  padding: 4px 12px;
}
</style>
