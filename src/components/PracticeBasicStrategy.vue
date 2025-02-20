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
let lastHandTime: Date|null = null
let interval: Date|null = null

type PlayedHand = {
    player: Card[]|null,
    dealer: Card|null,
    move: Play|null,
    expectedMove: Play|null,
    time: number|null
}

type Hands = {
    dealer: Card[],
    player: Card[],
    lastHand: PlayedHand|null,
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

type Log = {
    hands: PlayedHand[],
    view: boolean
}

const _hands: Hands = {
    dealer: [],
    player: [],
    lastHand: null,
    ignore: []
}

const _scores: Scores = {
    correct: 0,
    incorrect: 0,
    skipped: 0,
    remaining: () => (practiceCards.length),
    avgTime: () => {
        return renderTime(null, true)
    }
}

const _timer: Timer = {
    paused: false
}

const _log: Log = {
    hands: [],
    view: false
}

const hands = ref(_hands)
const scores = ref(_scores)
const timer = ref(_timer)
const log = ref(_log)

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
        const isSoft = !isPair && (hands.value.player[0].value === 11 || hands.value.player[1].value === 11)
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

    if (scores.value.correct + scores.value.incorrect > 0) {
        startTimer
    }
}

function play(move: Play) {
    if (practiceCards.length === 0) {
        return
    }

    const play = strategy.getPlay(hands.value.player, hands.value.dealer[0], false)
    if (move === play) {
        scores.value.correct++
    }
    else {
        scores.value.incorrect++
    }

    const lastHand = {
        player: hands.value.player,
        dealer: hands.value.dealer[0],
        move: move,
        expectedMove: play,
        time: interval && lastHandTime ? interval.getTime() - lastHandTime.getTime() : null 
    }

    lastHandTime = interval
    hands.value.lastHand = lastHand
    discardPile.push(hands.value.player.concat(hands.value.dealer))
    log.value.hands.push(lastHand)

    if (timer.value.paused) {
        pause()
    }

    deal()
}

function reset() {
    stopTimer()

    hands.value.player = []
    hands.value.dealer = []
    hands.value.lastHand = null
    scores.value.correct = 0
    scores.value.incorrect = 0
    scores.value.skipped = 0

    practiceCards = loadFullPractice(true)
    discardPile = []
    log.value.hands = []

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
    const isSoft = !isPair && (hands.value.player[0].value === 11 || hands.value.player[1].value === 11)
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

function viewLog() {
    log.value.view = !log.value.view
}

function renderTime(time: number|null, avg: boolean = false) {
    if (!time && !startTime) {
        return ""
    }
    else if (!time && startTime && interval) {
        time = interval.getTime() - startTime.getTime()
    }

    if (time === null) {
        return ""
    }

    if (avg) {
        time = time / (scores.value.correct + scores.value.incorrect)
    }

    const segment = (t: number) => {
        const secs = t % 60
        t = t / 60
        const mins = t % 60
        t = t / 60
        const hrs = t % 60
        t = t / 60
        return [Math.round(hrs), Math.round(mins), Math.round(secs)]
    }

    if (isNaN(time)) {
        return ""
    }

    time = time / 1000
    let [hrs, mins, secs] = [...segment(time)]
    let [hrS, minS, secS] = [...["", "", ""]]

    hrS = hrs < 10 ? "0" + hrs.toString() : hrs.toString()
    minS = mins < 10 ? "0" + mins.toString() : mins.toString()
    secS = secs < 10 ? "0" + secs.toString() : secs.toString()

    return `${hrS}:${minS}:${secS}`
}

const renderCards = (cards: Card[]) => {
    let cardS = ""
    cards.forEach((card, i) => {
        cardS += `${card.value < 10 ? card.value : card.face[0]}`
        if (i < cards.length - 1) {
            cardS += " "
        }
    })
    return cardS
}
const sumCards = (card: Card[]) => (card[0].value + (card.length > 1 ? card[1].value : 0))

const startTimer = setInterval(() => {
    if (!timer.value.paused) {
        if (!startTime) {
            startTime = new Date()
            lastHandTime = new Date()
        }
        interval = new Date()
    }
}, 1000)

const stopTimer = () => clearInterval(startTimer)

deal()

</script>

<template>
    <br />
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
            <div v-if="hands.lastHand && hands.lastHand.player && hands.lastHand.dealer && hands.lastHand.move">
                <h5>{{ renderCards(hands.lastHand.player) }} ({{ sumCards(hands.lastHand.player) }}) Vs {{ renderCards([hands.lastHand.dealer]) }} ({{ sumCards([hands.lastHand.dealer]) }})</h5>
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
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="viewLog()">
            LOG
        </div>
    </div>

    <br />
    <div class="bjck-practice-log" v-if="log.view" v-for="hand in log.hands">
        <h5 v-if="hand.player && hand.dealer && hand.move">
            {{ renderCards(hand.player) }} ({{ sumCards(hand.player) }}) Vs {{ renderCards([hand.dealer]) }} ({{ sumCards([hand.dealer]) }})
            <span v-if="hand.move !== hand.expectedMove" style="text-decoration: line-through;">{{ hand.move }}</span>
            {{ hand.expectedMove }}
            {{ renderTime(hand.time) }}
        </h5>
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

.bjck-practice-log {
    text-align: center;
}

</style>