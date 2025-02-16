export enum CardSuit {
    CLUB = "CLUB",
    DIAMOND = "DIAMOND",
    HEART = "HEART",
    SPADE = "SPADE" 
}

export enum CardFace {
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FIVE = "FIVE",
    SIX = "SIX",
    SEVEN = "SEVEN",
    EIGHT = "EIGHT",
    NINE = "NINE",
    TEN = "TEN",
    JACK = "JACK",
    QUEEN = "QUEEN",
    KING = "KING",
    ACE = "ACE"
}

export class Card {
    suit: CardSuit;
    face: CardFace;
    value: number;

    constructor(suit: CardSuit, face: CardFace) {
        this.suit = suit
        this.face = face
        
        switch (face) {
            case "TWO":
                this.value = 2
                break
            case "THREE":
                this.value = 3
                break
            case "FOUR":
                this.value = 4
                break
            case "FIVE":
                this.value = 5
                break
            case "SIX":
                this.value = 6
                break
            case "SEVEN":
                this.value = 7
                break
            case "EIGHT":
                this.value = 8
                break
            case "NINE":
                this.value = 9
                break
            case "ACE":
                this.value = 11
                break
            default:
                this.value = 10
                break
        }
    }
}

export const CardDeck = [
    new Card(CardSuit.CLUB, CardFace.TWO),
    new Card(CardSuit.CLUB, CardFace.THREE),
    new Card(CardSuit.CLUB, CardFace.FOUR),
    new Card(CardSuit.CLUB, CardFace.FIVE),
    new Card(CardSuit.CLUB, CardFace.SIX),
    new Card(CardSuit.CLUB, CardFace.SEVEN),
    new Card(CardSuit.CLUB, CardFace.EIGHT),
    new Card(CardSuit.CLUB, CardFace.NINE),
    new Card(CardSuit.CLUB, CardFace.TEN),
    new Card(CardSuit.CLUB, CardFace.JACK),
    new Card(CardSuit.CLUB, CardFace.QUEEN),
    new Card(CardSuit.CLUB, CardFace.KING),
    new Card(CardSuit.CLUB, CardFace.ACE),

    new Card(CardSuit.DIAMOND, CardFace.TWO),
    new Card(CardSuit.DIAMOND, CardFace.THREE),
    new Card(CardSuit.DIAMOND, CardFace.FOUR),
    new Card(CardSuit.DIAMOND, CardFace.FIVE),
    new Card(CardSuit.DIAMOND, CardFace.SIX),
    new Card(CardSuit.DIAMOND, CardFace.SEVEN),
    new Card(CardSuit.DIAMOND, CardFace.EIGHT),
    new Card(CardSuit.DIAMOND, CardFace.NINE),
    new Card(CardSuit.DIAMOND, CardFace.TEN),
    new Card(CardSuit.DIAMOND, CardFace.JACK),
    new Card(CardSuit.DIAMOND, CardFace.QUEEN),
    new Card(CardSuit.DIAMOND, CardFace.KING),
    new Card(CardSuit.DIAMOND, CardFace.ACE),

    new Card(CardSuit.HEART, CardFace.TWO),
    new Card(CardSuit.HEART, CardFace.THREE),
    new Card(CardSuit.HEART, CardFace.FOUR),
    new Card(CardSuit.HEART, CardFace.FIVE),
    new Card(CardSuit.HEART, CardFace.SIX),
    new Card(CardSuit.HEART, CardFace.SEVEN),
    new Card(CardSuit.HEART, CardFace.EIGHT),
    new Card(CardSuit.HEART, CardFace.NINE),
    new Card(CardSuit.HEART, CardFace.TEN),
    new Card(CardSuit.HEART, CardFace.JACK),
    new Card(CardSuit.HEART, CardFace.QUEEN),
    new Card(CardSuit.HEART, CardFace.KING),
    new Card(CardSuit.HEART, CardFace.ACE),

    new Card(CardSuit.SPADE, CardFace.TWO),
    new Card(CardSuit.SPADE, CardFace.THREE),
    new Card(CardSuit.SPADE, CardFace.FOUR),
    new Card(CardSuit.SPADE, CardFace.FIVE),
    new Card(CardSuit.SPADE, CardFace.SIX),
    new Card(CardSuit.SPADE, CardFace.SEVEN),
    new Card(CardSuit.SPADE, CardFace.EIGHT),
    new Card(CardSuit.SPADE, CardFace.NINE),
    new Card(CardSuit.SPADE, CardFace.TEN),
    new Card(CardSuit.SPADE, CardFace.JACK),
    new Card(CardSuit.SPADE, CardFace.QUEEN),
    new Card(CardSuit.SPADE, CardFace.KING),
    new Card(CardSuit.SPADE, CardFace.ACE),
]