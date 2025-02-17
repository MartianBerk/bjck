<script setup lang="ts">

import { ref } from "vue"
import { BasicStrategy, loadFullPractice } from "./basicstrategy"
import { Card } from "./cards"
import { Play } from "./play"
import CardView from "./CardView.vue"
import CrossOut from "./icons/CrossOut.vue"
import Pause from "./icons/Pause.vue"

const strategy = new BasicStrategy()
let practiceCards: Card[][] = loadFullPractice(true)
let discardPile: Card[][] = []
let startTime: Date|null = null
let interval: Date|null = null

type LastHand = {
    player: Function,
    dealer: Function,
    move: Play|null,
    expectedMove: Play|null,
    time: Function,
    index: number|null,  // keep track of the last hand in the discard pile
}

type Hands = {
    dealer: Card[],
    player: Card[],
    lastHand: LastHand,
    ignore: string[]
}

type Scores = {
    correct: number,
    incorrect: number,
    skipped: number,
    remaining: Function,
    avgTime: Function,
}

type Timer = {
    paused: boolean
}

const _lastHand: LastHand = {
    player: (cards: boolean = false) => {
        if (hands.value.lastHand.index === null) {
            return null
        }

        const playerCards = discardPile[hands.value.lastHand.index]
        if (cards) {
            const renderCard = (c: Card) => (c.value < 10 ? c.value : c.face[0])
            return `${renderCard(playerCards[0])} ${renderCard(playerCards[1])}`
        }
        else {
            return playerCards[0].value + playerCards[1].value
        }
    },
    dealer: (cards: boolean = false) => {
        if (hands.value.lastHand.index === null) {
            return null
        }

        const dealerCard = discardPile[hands.value.lastHand.index][2]
        if (cards) {
            return dealerCard.value < 10 ? dealerCard.value : dealerCard.face[0]
        }
        else {
            return dealerCard.value
        }
    },
    move: null,
    expectedMove: null,
    time: () => {
        return renderTimer(null)
    },
    index: null
}

const _hands: Hands = {
    dealer: [],
    player: [],
    lastHand: _lastHand,
    ignore: []
}

const _scores: Scores = {
    correct: 0,
    incorrect: 0,
    skipped: 0,
    remaining: () => (practiceCards.length),
    avgTime: () => {
        return renderTimer((scores.value.correct + scores.value.incorrect))
    }
}

const _timer: Timer = {
    paused: false
}

const hands = ref(_hands)
const scores = ref(_scores)
const timer = ref(_timer)

function deal() {
    if (practiceCards.length === 0) {
        return
    }

    let hand = practiceCards.splice(0, 1)
    hands.value.player = hand[0].slice(0, 2)
    hands.value.dealer = hand[0].slice(2)

    // Filtering
    while (hands.value.ignore.length > 0 && practiceCards.length > 0) {
        const isPair = hands.value.player[0].value === hands.value.player[1].value
        const isSoft = hands.value.player[0].value === 11 || hands.value.player[1].value === 11
        const isHard = !isSoft && !isPair
        
        const filterPair = hands.value.ignore.indexOf("PAIR") > -1 && isPair
        const filterSoft = hands.value.ignore.indexOf("ACE") > -1 && isSoft
        const filterHard = hands.value.ignore.indexOf("HARD") > -1 && isHard

        if (!filterPair && !filterSoft && !filterHard) {
            break
        }

        discardPile.push(hand[0])
        scores.value.skipped++
        deal()
    }

    if (scores.value.correct + scores.value.incorrect === 0) {
        startTimer
    }
}

function play(move: Play) {
    if (practiceCards.length === 0) {
        return
    }

    if (timer.value.paused) {
        pause()
    }

    const play = strategy.getPlay(hands.value.player, hands.value.dealer[0], false)
    if (move === play) {
        scores.value.correct++
    }
    else {
        scores.value.incorrect++
    }

    hands.value.lastHand.move = move
    hands.value.lastHand.expectedMove = play
    discardPile.push(hands.value.player.concat(hands.value.dealer))
    hands.value.lastHand.index = discardPile.length - 1
    deal()
}

function reset() {
    stopTimer()

    hands.value.player = []
    hands.value.dealer = []
    hands.value.lastHand.move = null
    hands.value.lastHand.expectedMove = null
    scores.value.correct = 0
    scores.value.incorrect = 0
    scores.value.skipped = 0
    startTime = null
    interval = null

    practiceCards = loadFullPractice(true)
    discardPile = []

    deal()
}

function filter(filter: string) {
    if (hands.value.ignore.indexOf(filter) > -1) {
        hands.value.ignore.splice(hands.value.ignore.indexOf(filter), 1)
    }
    else {
        hands.value.ignore.push(filter)
    }

    const isPair = hands.value.player[0].value === hands.value.player[1].value
    const isSoft = hands.value.player[0].value === 11 || hands.value.player[1].value === 11
    const isHard = !isSoft && !isPair
    
    const filterPair = hands.value.ignore.indexOf("PAIR") > -1 && isPair
    const filterSoft = hands.value.ignore.indexOf("ACE") > -1 && isSoft
    const filterHard = hands.value.ignore.indexOf("HARD") > -1 && isHard
    
    if (filterPair) {
        discardPile.push(hands.value.player.concat(hands.value.dealer))
        scores.value.skipped++
        deal()
    }
    else if (filterSoft) {
        discardPile.push(hands.value.player.concat(hands.value.dealer))
        scores.value.skipped++
        deal()
    }
    else if (filterHard) {
        discardPile.push(hands.value.player.concat(hands.value.dealer))
        scores.value.skipped++
        deal()
    }
}

function pause() {
    if (startTime) {
        timer.value.paused = !timer.value.paused
    }
}

function renderTimer(avgBy: number|null) {
    if (!startTime || !interval) {
        return ""
    }

    let time = interval.getTime() - startTime.getTime()
    if (avgBy) {
        time = time / (scores.value.correct + scores.value.incorrect)
    }

    const segment = (t: number) => {
        t = t / 1000
        const secs = t % 60
        t = t / 60
        const mins = t % 60
        t = t / 60
        const hrs = t % 60
        t = t / 60
        return [Math.floor(hrs), Math.floor(mins), Math.floor(secs)]
    }

    if (isNaN(time)) {
        return ""
    }

    let [hrs, mins, secs] = [...segment(time)]
    let [hrS, minS, secS] = [...["", "", ""]]

    hrS = hrs < 10 ? "0" + hrs.toString() : hrs.toString()
    minS = mins < 10 ? "0" + mins.toString() : mins.toString()
    secS = secs < 10 ? "0" + secs.toString() : secs.toString()

    return `${hrS}:${minS}:${secS}`
}

const startTimer = setInterval(() => {
    if (!timer.value.paused) {
        if (!startTime) {
            startTime = new Date()
        }
        interval = new Date()
    }
}, 100)

const stopTimer = () => clearInterval(startTimer)

deal()

</script>

<template>
    <div class="bjck-practice-section">
        <div>
            <h4>Scores</h4>
            <h5>Correct: {{ scores.correct }}</h5>
            <h5>Incorrect: {{ scores.incorrect }}</h5>
            <h5>Skipped: {{ scores.skipped }}</h5>
            <h5>Remaining: {{ scores.remaining() }}</h5>
            <h5>Avg. Time: {{ scores.avgTime() }}</h5>
        </div>
        <div class="bjck-practice-section-divider-large"></div>
        <div>
            <h4>Last Move</h4>
            <div v-if="hands.lastHand.move !== null">
                <h5>{{ hands.lastHand.player(true) }} ({{ hands.lastHand.player() }}) Vs {{ hands.lastHand.dealer(true) }} ({{ hands.lastHand.dealer() }})</h5>
                <h5>
                    <span v-if="hands.lastHand.move !== hands.lastHand.expectedMove" style="text-decoration: line-through;">{{ hands.lastHand.move }}</span>
                    {{ hands.lastHand.expectedMove }}
                </h5>
            </div>
            
        </div>
        <div class="bjck-practice-section-divider-large"></div>
        <div>
            <h4>Rules</h4>
            <h5 v-if="hands.ignore.indexOf('PAIR') > -1">Ignore Soft</h5>
            <h5 v-if="hands.ignore.indexOf('ACE') > -1">Ignore Split</h5>
            <h5 v-if="hands.ignore.indexOf('HARD') > -1">Ignore Hard</h5>
        </div>
    </div>

    <br />
    <div class="bjck-practice-section">
        <CardView :suit="hands.dealer[0].suit" :face="hands.dealer[0].face" :value="hands.dealer[0].value"/>
    </div>
    <br />
    <div class="bjck-practice-section">
        <CardView :suit="hands.player[0].suit" :face="hands.player[0].face" :value="hands.player[0].value"/>
        <div class="bjck-practice-section-divider"></div>
        <CardView :suit="hands.player[1].suit" :face="hands.player[1].face" :value="hands.player[1].value"/>
    </div>

    <br />
    <div class="bjck-practice-section">
        <div class="bjck-practice-button" @click="play(Play.HIT)">
            HIT
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="play(Play.STAND)">
            STAND
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="play(Play.SPLIT)">
            SPLIT
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="play(Play.DOUBLE)">
            DOUBLE
        </div>
    </div>

    <br />
    <div class="bjck-practice-section">
        <div class="bjck-practice-button" @click="filter('HARD')">
            HARD
            <div v-if="hands.ignore.indexOf('HARD') > -1">
                <CrossOut />
            </div>
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="filter('PAIR')">
            SPLIT
            <div v-if="hands.ignore.indexOf('PAIR') > -1">
                <CrossOut />
            </div>
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="filter('ACE')">
            SOFT
            <div v-if="hands.ignore.indexOf('ACE') > -1">
                <CrossOut />
            </div>
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="pause()">
            PAUSE
            <div v-if="timer.paused">
                <Pause />
            </div>
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="reset()">
            RESET
        </div>
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