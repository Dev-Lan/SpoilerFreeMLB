import { ref, computed, watch } from 'vue'
import { teamColors } from '../api/teamColors'

const STORAGE_KEY = 'sfb-favorite-teams'

function load(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const favorites = ref<number[]>(load())

watch(favorites, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

const headerColor = computed(() => {
  if (favorites.value.length === 0) return '#1a472a' // default primary
  return teamColors[favorites.value[0]] ?? '#1a472a'
})

export function useFavorites() {
  function isFavorite(teamId: number): boolean {
    return favorites.value.includes(teamId)
  }

  function toggleFavorite(teamId: number) {
    const idx = favorites.value.indexOf(teamId)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(teamId)
    }
  }

  return { favorites, isFavorite, toggleFavorite, headerColor }
}
