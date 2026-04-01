<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated :style="{ backgroundColor: headerColor }">
      <q-toolbar>
        <img src="/spoiler-baseball.png" alt="Logo" class="header-logo" />
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
.header-logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
  margin-right: 8px;
}
.accent-stripe {
  height: 4px;
  width: 100%;
}
</style>
