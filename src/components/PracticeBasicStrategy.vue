<script setup lang="ts">

import { ref } from "vue"
import { BasicStrategy, loadFullPractice } from "./basicstrategy"
import { Play } from "./play"
import Card from "./Card.vue"
import CrossOut from "./icons/CrossOut.vue"

const strategy = new BasicStrategy()
let practiceCards = loadFullPractice(true)
let discardPile = []

const hands = ref({
    dealer: [],
    player: [],
    lastHand: {
        player: (cards: boolean = false) => {
            if (discardPile.length === 0) {
                return null
            }

            const playerCards = discardPile[discardPile.length - 1]
            if (cards) {
                const renderCard = (c) => (c.value < 10 ? c.value : c.face[0])
                return `${renderCard(playerCards[0])} ${renderCard(playerCards[1])}`
            }
            else {
                return playerCards[0].value + playerCards[1].value
            }
        },
        dealer: (cards: boolean = false) => {
            if (discardPile.length === 0) {
                return null
            }

            const dealerCard = discardPile[discardPile.length - 1][2]
            if (cards) {
                return dealerCard.value < 10 ? dealerCard.value : dealerCard.face[0]
            }
            else {
                return dealerCard.value
            }
        },
        move: null,
        expectedMove: null
    },
    ignore: []
})

const scores = ref({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    remaining: () => (practiceCards.length)
})

function deal() {
    let hand = practiceCards.splice(0, 1)
    hands.value.player = hand[0].slice(0, 2)
    hands.value.dealer = hand[0].slice(2)

    // Filtering
    while (hands.value.ignore.length > 0 && practiceCards.length > 0) {
        if (hands.value.ignore.indexOf("PAIR") > -1 && hands.value.player[0].value !== hands.value.player[1].value) {
            break
        }
        else if (hands.value.ignore.indexOf("ACE") > -1 && hands.value.player[0].value !== 11 && hands.value.player[1].value !== 11) {
            break
        }

        discardPile.push(hand)
        scores.value.skipped++
        deal()
    }
}

function play(move: Play) {
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
    deal()
}

function reset() {
    hands.value.player = []
    hands.value.dealer = []
    hands.value.lastHand.move = null
    hands.value.lastHand.expectedMove = null
    scores.value.correct = 0
    scores.value.incorrect = 0
    scores.value.skipped = 0

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

    if (hands.value.ignore.indexOf("PAIR") > -1 && hands.value.player[0].value === hands.value.player[1].value) {
        discardPile.push(hands.value.player.concat(hands.value.dealer))
        scores.value.skipped++
        deal()
    }
    else if (hands.value.ignore.indexOf("ACE") > -1 && (hands.value.player[0].value === 11 || hands.value.player[1].value === 11)) {
        discardPile.push(hands.value.player.concat(hands.value.dealer))
        scores.value.skipped++
        deal()
    }
}

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
            <h5 v-if="hands.ignore.indexOf('PAIR') > -1">Ignore Pairs</h5>
            <h5 v-if="hands.ignore.indexOf('ACE') > -1">Ignore Aces</h5>
        </div>
    </div>
    
    <br />
    

    <br />
    <div class="bjck-practice-section">
        <Card :suit="hands.dealer[0].suit" :face="hands.dealer[0].face" :value="hands.dealer[0].value"/>
    </div>
    <br />
    <div class="bjck-practice-section">
        <Card :suit="hands.player[0].suit" :face="hands.player[0].face" :value="hands.player[0].value"/>
        <div class="bjck-practice-section-divider"></div>
        <Card :suit="hands.player[1].suit" :face="hands.player[1].face" :value="hands.player[1].value"/>
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
        <div class="bjck-practice-button" @click="filter('PAIR')">
            PAIRS
            <div v-if="hands.ignore.indexOf('PAIR') > -1">
                <CrossOut />
            </div>
        </div>
        <div class="bjck-practice-section-divider"></div>
        <div class="bjck-practice-button" @click="filter('ACE')">
            ACES
            <div v-if="hands.ignore.indexOf('ACE') > -1">
                <CrossOut />
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