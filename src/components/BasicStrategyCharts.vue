<script setup lang="ts">

import { ref } from "vue"
import { BasicStrategy } from "./basicstrategy"
import { Play } from "./play"

const strategy = new BasicStrategy()

type Chart = {
    columns: number[],
    index: number[],
    grid: (Play|null)[][]
}

const _chart: Chart = {
    columns: [],
    index: [],
    grid: []
}

const chart = ref(_chart)

menu("HARD")

function menu(option: string) {
    chart.value.columns = strategy.dealer
    chart.value.index = []

    if (option === "HARD") {
        chart.value.grid = reverseChart(strategy.hardChart)
        for (let i = strategy.playerHard.length; i >=0; i--) {
            chart.value.index.push(strategy.playerHard[i])
        }
    }
    else if (option === "SOFT") {
        chart.value.grid = reverseChart(strategy.softChart)
        for (let i = strategy.playerSoft.length; i >=0; i--) {
            chart.value.index.push(strategy.playerSoft[i])
        }
    }
    else if (option === "PAIR") {
        chart.value.grid = reverseChart(strategy.pairChart)
        for (let i = strategy.playerPair.length; i >=0; i--) {
            chart.value.index.push(strategy.playerPair[i])
        }
    }
}

function reverseChart(chart: (Play|null)[][]) {
    let reversed = []
    for(var i = chart.length-1; i >= 0; i--) {
        reversed.push(chart[i]);
    }
    return reversed
}

function renderPlay(play: Play|null): string {
    switch (play) {
        case Play.DOUBLE:
            return "D"
        case Play.HIT:
            return "H"
        case Play.SPLIT:
            return "Y"
        case Play.STAND:
            return "S"
        default:
            return "N"
        
    }
}

</script>

<template>

    <br />
    <div class="bjck-chart-menu">
        <h5 class="bjck-chart-menu" @click="menu('HARD')">Hard</h5>
        <div class="bjck-chart-menu-divider"></div>
        <h5 class="bjck-chart-menu" @click="menu('SOFT')">Soft</h5>
        <div class="bjck-chart-menu-divider"></div>
        <h5 class="bjck-chart-menu" @click="menu('PAIR')">Pair</h5>
    </div>

    <br />
    <div class="bjck-chart">
        <div class="bjck-chart-row">
            <div class="bjck-chart-cell">__</div>
            <div class="bjck-chart-cell" v-for="col in chart.columns">
                {{ col }}
            </div>
        </div>
        <div class="bjck-chart-row" v-for="row, i in chart.grid">
            <div class="bjck-chart-cell">
                {{ chart.index[i+1] }}
            </div>
            <div class="bjck-chart-cell" v-for="cell in row">
                {{ renderPlay(cell) }}
            </div>
            <br />
        </div>
    </div>

</template>

<style>

.bjck-chart {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
}

.bjck-chart-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.bjck-chart-cell {
    margin-left: 10px;
    margin-right: 10px;
}

.bjck-chart-menu {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

.bjck-chart-menu-divider {
    padding-left: 5px;
    padding-right: 5px;
}

</style>