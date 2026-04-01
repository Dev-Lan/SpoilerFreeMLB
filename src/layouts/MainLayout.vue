<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated :style="{ backgroundColor: headerColor }">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          Spoiler-Free Baseball
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useFavorites } from '../composables/useFavorites'

const { headerColor } = useFavorites()
</script>
