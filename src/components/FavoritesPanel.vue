<template>
  <div>
    <div class="q-gutter-lg">
      <div v-for="teamId in favorites" :key="teamId" class="favorite-team-section">
        <div class="row items-center q-mb-sm q-gutter-sm">
          <img :src="teamLogoUrl(teamId)" class="fav-team-logo" />
          <span class="text-subtitle1 text-weight-bold">
            {{ getTeam(teamId)?.name ?? `Team ${teamId}` }}
          </span>
          <q-btn
            flat round dense
            icon="star"
            color="amber"
            size="sm"
            @click="toggleFavorite(teamId)"
          />
        </div>

        <div v-if="teamLoading[teamId]" class="text-center q-pa-sm">
          <q-spinner size="2em" />
        </div>
        <div v-else-if="teamGames[teamId]?.length">
          <GameCard :game="teamGames[teamId][0]" />
          <div class="text-center text-caption text-grey-8 q-mt-xs">
            {{ relativeDate(teamGames[teamId][0].officialDate) }}
          </div>
        </div>
        <div v-else class="text-grey-8 q-pa-md">
          No upcoming games found.
        </div>
        <q-separator v-if="favorites.indexOf(teamId) < favorites.length - 1" class="q-mt-md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { SanitizedGame } from '../api/types'
import { fetchTeamSchedule, teamLogoUrl } from '../api/mlb'
import { useFavorites } from '../composables/useFavorites'
import { useTeams } from '../composables/useTeams'
import GameCard from './GameCard.vue'

const { favorites, toggleFavorite } = useFavorites()
const { getTeam } = useTeams()

const teamGames = ref<Record<number, SanitizedGame[]>>({})
const teamLoading = ref<Record<number, boolean>>({})

function relativeDate(officialDate: string): string {
  const today = new Date()
  const todayStr = formatDate(today)
  const target = new Date(officialDate + 'T12:00:00')
  const todayNoon = new Date(todayStr + 'T12:00:00')
  const diffDays = Math.round((target.getTime() - todayNoon.getTime()) / 86_400_000)

  const short = target.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  if (diffDays === 0) return `Today \u00B7 ${short}`
  if (diffDays === 1) return `Tomorrow \u00B7 ${short}`
  if (diffDays === -1) return `Yesterday \u00B7 ${short}`

  const dayName = target.toLocaleDateString(undefined, { weekday: 'short' })
  if (diffDays >= 2 && diffDays <= 6) return `${dayName} \u00B7 ${short}`
  if (diffDays <= -2 && diffDays >= -6) return `Last ${dayName} \u00B7 ${short}`

  return short
}

function formatDate(d: Date): string {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}

async function loadTeamGames(teamId: number) {
  teamLoading.value[teamId] = true
  try {
    const today = new Date()
    const todayStr = formatDate(today)
    const end = new Date(today)
    end.setDate(end.getDate() + 14)

    const allGames = await fetchTeamSchedule(
      teamId,
      todayStr,
      formatDate(end),
    )

    // Today's game takes priority; otherwise show the next future game
    const todayGame = allGames.find((g) => g.officialDate === todayStr)
    if (todayGame) {
      teamGames.value[teamId] = [todayGame]
    } else if (allGames.length > 0) {
      teamGames.value[teamId] = [allGames[0]]
    } else {
      teamGames.value[teamId] = []
    }
  } catch (e) {
    console.error(`Failed to load games for team ${teamId}:`, e)
    teamGames.value[teamId] = []
  } finally {
    teamLoading.value[teamId] = false
  }
}

async function loadAll() {
  await Promise.all(favorites.value.map(loadTeamGames))
}

watch(favorites, loadAll, { deep: true })
onMounted(loadAll)
</script>

<style scoped>
.fav-team-logo {
  width: 32px;
  height: 32px;
}
.current-game {
  transform: scale(1.02);
}
</style>
