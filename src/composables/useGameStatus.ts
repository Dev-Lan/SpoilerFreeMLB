import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { SanitizedGame } from '../api/types'
import { fetchDailySchedule } from '../api/mlb'

export function useGameStatus(date: () => string) {
  const games = ref<SanitizedGame[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null
  let visible = true

  async function load() {
    loading.value = true
    error.value = null
    try {
      games.value = await fetchDailySchedule(date())
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load games'
    } finally {
      loading.value = false
    }
  }

  function hasLiveGames(): boolean {
    return games.value.some((g) => g.status.abstractGameState === 'Live')
  }

  function startPolling() {
    stopPolling()
    const interval = hasLiveGames() ? 60_000 : 300_000
    timer = setInterval(() => {
      if (visible) load()
    }, interval)
  }

  function stopPolling() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function onVisibilityChange() {
    visible = document.visibilityState === 'visible'
    if (visible) load()
  }

  watch(date, () => {
    load().then(startPolling)
  })

  watch(games, () => {
    startPolling()
  })

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)
    load().then(startPolling)
  })

  onUnmounted(() => {
    stopPolling()
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return { games, loading, error, refresh: load }
}
