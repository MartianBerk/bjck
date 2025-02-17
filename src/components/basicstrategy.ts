import { Card, CardFace, CardSuit } from "./cards"
import { Play } from "./play"

function searchForArray(haystack: number[][], needle: number[]){
    var i, j, current;
    for(i = 0; i < haystack.length; ++i){
      if(needle.length === haystack[i].length){
        current = haystack[i];
        for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
        if(j === needle.length)
          return i;
      }
    }
    return -1;
  }

export function loadFullPractice(random: boolean = false): Card[][] {
    let practice: Card[][] = []
    let seen: number[][] = []
    Object.entries(CardFace).forEach(([_, l]) => {
        if ([CardFace.JACK, CardFace.QUEEN, CardFace.KING].indexOf(l) > -1) {
            return
        }
        Object.entries(CardFace).forEach(([_, r]) => {
            if ([CardFace.JACK, CardFace.QUEEN, CardFace.KING].indexOf(r) > -1) {
                return
            }
            else if ((l === CardFace.TEN && r === CardFace.ACE) || (l === CardFace.ACE && r === CardFace.TEN)) {
                return
            }
            Object.entries(CardFace).forEach(([_, d]) => {
                const hand = [new Card(CardSuit.SPADE, l), new Card(CardSuit.SPADE, r), new Card(CardSuit.SPADE, d)]
                const lookup = [hand[0].value, hand[1].value, hand[2].value]
                const reverseLookup = [lookup[1], lookup[0], lookup[2]]
                if ([CardFace.JACK, CardFace.QUEEN, CardFace.KING].indexOf(d) > -1) {
                    return
                }
                else if (searchForArray(seen, lookup) > -1 || searchForArray(seen, reverseLookup) > -1) {
                    return
                }
                practice.push(hand)
                seen.push(lookup)
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
            for (let i = 0; i < this.playerPair.length; i++) {
                if (handTotal === this.playerPair[i]) {
                    playerLookup = i
                    break
                }
            }
        }
        else if (isSoft) {
            for (let i = 0; i < this.playerSoft.length; i++) {
                if (handTotal === this.playerSoft[i]) {
                    playerLookup = i
                    break
                }
            }
        }
        else {
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
            const play = this.pairChart[playerLookup][dealerLookup]
            if (!play) {
                return this.getPlay(cards, dealer, true)
            }
        }

        return this.hardChart[playerLookup][dealerLookup]
    }
}