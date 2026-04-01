<template>
  <div class="row items-center justify-center q-gutter-sm">
    <q-btn flat round icon="chevron_left" @click="prev" />
    <q-btn flat no-caps :label="displayDate" class="date-label">
      <q-popup-proxy>
        <q-date v-model="proxyDate" @update:model-value="onPick" mask="YYYY-MM-DD" />
      </q-popup-proxy>
    </q-btn>
    <q-btn flat round icon="chevron_right" @click="next" />
    <q-btn flat dense label="Today" size="sm" @click="goToday" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const proxyDate = ref(props.modelValue)

const displayDate = computed(() => {
  const d = new Date(props.modelValue + 'T12:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
})

function shift(days: number) {
  const d = new Date(props.modelValue + 'T12:00:00')
  d.setDate(d.getDate() + days)
  const val = formatDate(d)
  proxyDate.value = val
  emit('update:modelValue', val)
}

function prev() { shift(-1) }
function next() { shift(1) }

function goToday() {
  const val = formatDate(new Date())
  proxyDate.value = val
  emit('update:modelValue', val)
}

function onPick(val: string | null) {
  if (val) emit('update:modelValue', val)
}

function formatDate(d: Date): string {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}
</script>

<style scoped>
.date-label {
  font-size: 1rem;
  min-width: 140px;
}
</style>
