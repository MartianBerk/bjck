<script setup lang="ts">
import { ref } from "vue"

import BasicStrategyCharts from '@/components/BasicStrategyCharts.vue'
import PracticeBasicStrategy from '@/components/PracticeBasicStrategy.vue'

type View = {
    practice: boolean,
    charts: boolean,
}

const _view: View = {
    practice: true,
    charts: false
}

const view = ref(_view)

function menu(option: string) {
    if (option === "PRACTICE") {
        view.value.practice = true
        view.value.charts = false
    }
    else if (option === "CHARTS") {
        view.value.practice = false
        view.value.charts = true
    }
}

</script>

<template>
    <br />
    <main>
        <div class="bjck-menu">
            <h4 class="bjck-menu" @click="menu('PRACTICE')">Practice</h4>
            <div class="bjck-menu-divider"></div>
            <h4 class="bjck-menu" @click="menu('CHARTS')">Charts</h4>
        </div>
        <div v-if="view.practice === true">
            <PracticeBasicStrategy />
        </div>
        <div v-if="view.charts === true">
            <BasicStrategyCharts />
        </div>
    </main>
</template>

<style>

.bjck-menu {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

.bjck-menu-divider {
    padding-left: 5px;
    padding-right: 5px;
}

</style>
