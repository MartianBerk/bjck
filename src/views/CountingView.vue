<script setup lang="ts">
import { ref } from "vue"

import PracticeCounting from '@/components/PracticeCounting.vue'

type View = {
    practice: boolean
}

const _view: View = {
    practice: true
}

const view = ref(_view)

function menu(option: string) {
    if (option === "PRACTICE") {
        view.value.practice = true
    }
}

</script>

<template>
    <br />
    <main>
        <div class="bjck-menu">
            <h4 class="bjck-menu" @click="menu('PRACTICE')">Practice</h4>
        </div>
        <div v-if="view.practice === true">
            <PracticeCounting />
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
