import { Card, CardFace, CardSuit } from "./cards"
import { Play } from "./play"

export function loadFullPractice(random: boolean = false) {
    let practice: Card[][] = []
    Object.entries(CardFace).forEach(([_, l]) => {
        Object.entries(CardFace).forEach(([_, r]) => {
            Object.entries(CardFace).forEach(([_, d]) => {
                practice.push([new Card(CardSuit.SPADE, l), new Card(CardSuit.SPADE, r), new Card(CardSuit.SPADE, d)])
            })
        })
    })

    if (random) {
        let currentIndex = practice.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [practice[currentIndex], practice[randomIndex]] = [
                practice[randomIndex], practice[currentIndex]
            ];
        }
    }

    return practice
}

export class BasicStrategy {
    dealer: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    playerHard: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    playerPair: number[] = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
    playerSoft: number[] = [13, 14, 15, 16, 17, 18, 19, 20]
    hardChart: Play[][] = [
        [Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.HIT, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.HIT, Play.HIT],
        [Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE],
        [Play.HIT, Play.HIT, Play.STAND, Play.STAND, Play.STAND, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND],
    ]
    softChart: Play[][] = [
        [Play.HIT, Play.HIT, Play.HIT, Play.DOUBLE, Play.DOUBLE, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.HIT, Play.HIT, Play.HIT, Play.DOUBLE, Play.DOUBLE, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.HIT, Play.HIT, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.HIT, Play.HIT, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.HIT, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.HIT, Play.HIT, Play.HIT, Play.HIT, Play.HIT],
        [Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.DOUBLE, Play.STAND, Play.STAND, Play.HIT, Play.HIT, Play.HIT],
        [Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.DOUBLE, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND],
        [Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND, Play.STAND],
    ]
    pairChart: (Play|null)[][] = [
        [Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, null, null, null, null],
        [Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, null, null, null, null],
        [null, null, null, Play.SPLIT, Play.SPLIT, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, null, null, null, null, null],
        [Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, null, null, null, null],
        [Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT],
        [Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, null, Play.SPLIT, Play.SPLIT, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT, Play.SPLIT]
    ]

    getPlay(cards: Card[], dealer: Card, forceNoPair: boolean = false): Play {
        const handTotal = cards.reduce((handTotal, c, i, a) => {
            handTotal = handTotal + c.value
            if (handTotal > 21 && a.length === 2 && c.value === a[i-1].value) {
                // special case of pair of aces, allow for split
            }
            else if (handTotal > 21 && c.value == 11) {
                handTotal = handTotal - c.value + 1
            }
            return handTotal
        }, 0)

        const noSplit = cards.length > 2 || cards[0].value !== cards[1].value || forceNoPair
        const isSoft = noSplit && cards.length == 2 && (cards[0].value === 11 || cards[1].value === 11)

        switch (true) {
            case (handTotal > 21 && noSplit):
                return Play.BUST
            case (handTotal === 21):
                return Play.STAND
            case (handTotal > 17 && !isSoft && noSplit):
                return Play.STAND
            case (handTotal < 8 && noSplit):
                console.log("Playing HIT early")
                return Play.HIT
            default:
                break
        }

        let dealerLookup = 0
        for (let i = 0; i < this.dealer.length; i++) {
            if (dealer.value === this.dealer[i]) {
                dealerLookup = i
                break
            }
        }

        let playerLookup = 0
        if (!noSplit && cards[0].value === cards[1].value) {
            console.log(`Playing PAIR with hand of ${handTotal}`)
            for (let i = 0; i < this.playerPair.length; i++) {
                if (handTotal === this.playerPair[i]) {
                    playerLookup = i
                    break
                }
            }
        }
        else if (isSoft) {
            console.log("Playing SOFT")
            for (let i = 0; i < this.playerSoft.length; i++) {
                if (handTotal === this.playerSoft[i]) {
                    playerLookup = i
                    break
                }
            }
        }
        else {
            console.log(`Playing HARD with hand of ${handTotal}`)
            for (let i = 0; i < this.playerHard.length; i++) {
                if (handTotal === this.playerHard[i]) {
                    playerLookup = i
                    break
                }
            }
        }
        
        if (cards.length > 2) {
            return this.hardChart[playerLookup][dealerLookup]
        }
        else if (isSoft) {
            return this.softChart[playerLookup][dealerLookup]
        }
        else if (!noSplit && cards[0].value === cards[1].value) {
            console.log(`PAIR[${playerLookup}][${dealerLookup}]`)
            const play = this.pairChart[playerLookup][dealerLookup]
            console.log(play)
            if (!play) {
                return this.getPlay(cards, dealer, true)
            }
        }

        return this.hardChart[playerLookup][dealerLookup]
    }
}