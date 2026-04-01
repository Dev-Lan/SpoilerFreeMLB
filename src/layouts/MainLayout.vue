<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated :style="{ backgroundColor: headerColor }">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          MLB (Spoiler Free)
        </q-toolbar-title>
      </q-toolbar>
      <div v-if="favorites.length > 0" class="accent-stripe" :style="{ backgroundColor: accentColor }" />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useFavorites } from "../composables/useFavorites";

const { favorites, headerColor, accentColor } = useFavorites();
</script>

<style scoped>
.accent-stripe {
  height: 4px;
  width: 100%;
}
</style>
