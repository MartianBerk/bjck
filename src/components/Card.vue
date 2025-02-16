<script setup lang="ts">
import { Card } from "./cards"
import ClubSuit from "./icons/ClubSuit.vue"
import DiamondSuit from "./icons/DiamondSuit.vue"
import HeartSuit from "./icons/HeartSuit.vue"
import SpadeSuit from "./icons/SpadeSuit.vue"

defineProps<{
  suit: string
  face: string
  value: number
}>()
</script>

<template>
  <div class="bjck-card">
    <div class="bjck-card-section bjck-card-section-top">
        {{ value < 10 || face == "TEN" ? value.toString() : face[0] }}
    </div>
    <div class="bjck-card-section">
        <ClubSuit v-if="suit==='CLUB'" />
        <DiamondSuit v-else-if="suit==='DIAMOND'" />
        <HeartSuit v-else-if="suit==='HEART'" />
        <SpadeSuit v-else="suit==='SPADE'" />
    </div>
    <div class="bjck-card-section bjck-card-section-bottom">
        {{ value < 10 || face == "TEN" ? value.toString() : face[0] }}
    </div>
  </div>
</template>

<style>

.bjck-card {
    background-color: white;
    color: black;
    width: 60px;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.bjck-card-section {
    padding: 5px;
    margin: 5px;
}

.bjck-card-section-top {
    text-align: left;
}

.bjck-card-section-bottom {
    text-align: right;
}

</style>
