<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          Spoiler-Free Baseball
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs v-model="tab" align="center" active-color="white" indicator-color="white">
        <q-route-tab name="games" label="All Games" to="/" exact />
        <q-route-tab name="favorites" label="My Teams" to="/favorites" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('games')
</script>
