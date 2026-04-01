import { ref, onMounted } from 'vue'
import type { Team } from '../api/types'
import { fetchTeams } from '../api/mlb'

const teams = ref<Map<number, Team>>(new Map())
const loaded = ref(false)

export function useTeams() {
  onMounted(async () => {
    if (loaded.value) return
    try {
      const list = await fetchTeams()
      const map = new Map<number, Team>()
      for (const t of list) {
        map.set(t.id, t)
      }
      teams.value = map
      loaded.value = true
    } catch (e) {
      console.error('Failed to fetch teams:', e)
    }
  })

  function getTeam(id: number): Team | undefined {
    return teams.value.get(id)
  }

  return { teams, getTeam }
}
