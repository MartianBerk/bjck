<script setup lang="ts">
import { ref } from "vue"
import { Card, CardDeck, shuffle } from "./cards"
import CardView from "./CardView.vue"

enum Method {
    OMEGA2 = "OMEGA2"
}

type Settings = {
    method: Method
}

type Count = {
    deck: Card[],
    discard: Card[],
    count: number,
    showCount: boolean
}

const _settings: Settings = {
    method: Method.OMEGA2
}

const _count: Count = {
    deck: [],
    discard: [],
    count: 0,
    showCount: false
}

const settings = ref(_settings)
const count = ref(_count)

function start() {
    const deck = CardDeck.concat(CardDeck)
    shuffle(deck)
    count.value.deck = deck
    count.value.discard = []
    counter(true)
}

function draw() {
    const card = count.value.deck.splice(0, 1)
    if (card.length > 0) {
        count.value.discard.push(card[0])
        counter()
    }
    
}

function toggleCount() {
    count.value.showCount = !count.value.showCount
}

function counter(reset: boolean = false) {
    if (reset) {
        count.value.count = 0
    }
    
    if (settings.value.method === Method.OMEGA2) {
        switch (count.value.deck[0].value) {
            case 2:
                count.value.count += 1
                break
            case 3:
                count.value.count += 1
                break
            case 4:
                count.value.count += 2
                break
            case 5:
                count.value.count += 2
                break
            case 6:
                count.value.count += 2
                break
            case 7:
                count.value.count += 1
                break
            case 8:
                break
            case 9:
                count.value.count -= 1
                break
            case 10:
                count.value.count -= 2
                break
            case 11:
                break
        }
    }
}

start()

</script>

<template>
    <br />
    <div class="bjck-practice-section">
        <CardView :suit="count.deck[0].suit" :face="count.deck[0].face" :value="count.deck[0].value"/>
    </div>

    <br />
    <div class="bjck-practice-section">
        <div class="bjck-practice-button" @click="draw()">
            DRAW
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="toggleCount()">
            COUNT
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="start()">
            RESET
        </div>
    </div>

    <br />
    <div v-if="count.showCount" class="bjck-practice-section">
        <h4>Count: {{ count.count }}</h4>
    </div>
    
</template>

<style>

.bjck-practice-section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: center;
}

.bjck-practice-section-divider {
    padding-left: 5px;
    padding-right: 5px;
}

.bjck-practice-section-divider-large {
    padding-left: 15px;
    padding-right: 15px;
}

.bjck-practice-button {
    cursor: pointer;
}

</style>