<template>
  <div>
    <div v-if="anyLoading" class="text-center q-pa-sm">
      <q-spinner size="2em" />
    </div>
    <div v-else class="row justify-center q-gutter-md">
      <GameCard
        v-for="game in pinnedGames"
        :key="game.gamePk"
        :game="game"
        :date-label="relativeDate(game.officialDate)"
        pinned
      />
      <div
        v-if="pinnedGames.length === 0 && favorites.length > 0"
        class="text-grey-8 q-pa-md text-center"
      >
        No upcoming games found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { SanitizedGame } from '../api/types'
import { fetchTeamSchedule } from '../api/mlb'
import { useFavorites } from '../composables/useFavorites'
import GameCard from './GameCard.vue'

const { favorites } = useFavorites()

const teamGames = ref<Record<number, SanitizedGame[]>>({})
const teamLoading = ref<Record<number, boolean>>({})

const anyLoading = computed(() =>
  favorites.value.some((id) => teamLoading.value[id]),
)

const pinnedGames = computed(() => {
  const games: SanitizedGame[] = []
  const seen = new Set<number>()
  for (const teamId of favorites.value) {
    const list = teamGames.value[teamId] ?? []
    for (const g of list) {
      if (!seen.has(g.gamePk)) {
        seen.add(g.gamePk)
        games.push(g)
      }
    }
  }
  return games
})

function relativeDate(officialDate: string): string {
  const today = new Date()
  const todayStr = formatDate(today)
  const target = new Date(officialDate + 'T12:00:00')
  const todayNoon = new Date(todayStr + 'T12:00:00')
  const diffDays = Math.round((target.getTime() - todayNoon.getTime()) / 86_400_000)

  const short = target.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'

  const dayName = target.toLocaleDateString(undefined, { weekday: 'short' })
  if (diffDays >= 2 && diffDays <= 6) return dayName
  if (diffDays <= -2 && diffDays >= -6) return `Last ${dayName}`

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
