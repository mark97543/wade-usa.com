import React,{useState, useEffect} from 'react'
import initialDeck from './cards.json'
import './War.css'
import { cardImageModules } from './imageLoader';

const shuffle = (arrayInput, setState) => {
  let newArray = [...arrayInput];
  for (let i = newArray.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[random]] = [newArray[random], newArray[i]]; 
  }
  setState(newArray);
};


const deal = (deckToDeal, currentP1Hand, currentP2Hand, setPlayer1Hand, setPlayer2Hand, setMainDeck) => {
    let newP1Hand = [...currentP1Hand];
    let newP2Hand = [...currentP2Hand];

    for (let i = 0; i < deckToDeal.length; i++) {
        if (i % 2 === 0) {
            newP1Hand.push(deckToDeal[i]);
        } else {
            newP2Hand.push(deckToDeal[i]);
        }
    }
    setPlayer1Hand(newP1Hand);
    setPlayer2Hand(newP2Hand);
};

const collect_spoils =(setCards, playerhand, pDraw)=>{
    let newHand = [...playerhand]
    newHand.push(pDraw)

    newHand = moveTopCardToBottom(newHand)

    setCards(newHand)

}

const moveTopCardToBottom = (currentHand) => {
  // Ensure the hand is not empty and has at least two cards for the move to be meaningful.
  // If there's 0 or 1 card, returning a copy is fine as the order doesn't change.
  if (!currentHand || currentHand.length < 2) {
    return [...currentHand]; // Return a new copy of the hand
  }

  // Create a new array to avoid mutating the original state directly
  const newHand = [...currentHand]; 
  
  // 1. Remove the top card (first element) from the newHand array.
  //    `shift()` removes the first element and returns it.
  const topCard = newHand.shift(); 

  // 2. Add that top card to the end of the newHand array.
  //    `push()` adds elements to the end.
  if (topCard !== undefined) { // Ensure a card was actually removed (for safety, though length check helps)
    newHand.push(topCard);
  }
  
  return newHand; // Return the modified new hand
};

const lose_a_card=(setPlayer2Hand, player2Hand, p2Draw)=>{
    const idToRemove = p2Draw.id;
    setPlayer2Hand(player2Hand.filter(item => item.id !== idToRemove));
}

const handleWar = (currentP1Hand, currentP2Hand, setPlayer1Hand, setPlayer2Hand, setMessage, setDraw, warPileAccumulator) => {
    const warCardsToDraw = 3; // Number of cards to place face down (standard is 3)

    // Announce the war and current stakes
    setMessage(`War! Current pile: ${warPileAccumulator.length} cards.`);
    console.log(`War! Initial pile has ${warPileAccumulator.length} cards. P1 has ${currentP1Hand.length}, P2 has ${currentP2Hand.length} cards remaining for this war round.`);

    // Hands for this specific war round (copies to be modified)
    let p1HandForWar = [...currentP1Hand];
    let p2HandForWar = [...currentP2Hand];

    // --- Initial card check for entering war (should have at least 1 card for face-up) ---
    if (p1HandForWar.length === 0 && p2HandForWar.length === 0) {
        setMessage("Neither player has cards for war! Spoils are tied/discarded.");
        // No change to hands, spoils are effectively lost from warPileAccumulator
        setPlayer1Hand(p1HandForWar); // p1HandForWar is empty
        setPlayer2Hand(p2HandForWar); // p2HandForWar is empty
        setDraw([null, null]); // Clear draw display
        return;
    }
    if (p1HandForWar.length === 0) {
        setMessage("Player 1 has no cards for war! Computer wins the spoils.");
        setPlayer2Hand(prev => [...prev, ...warPileAccumulator]); // P2 gets current pile
        setPlayer1Hand([]); // P1 hand is confirmed empty
        setDraw([null, null]);
        return;
    }
    if (p2HandForWar.length === 0) {
        setMessage("Computer has no cards for war! Player 1 wins the spoils.");
        setPlayer1Hand(prev => [...prev, ...warPileAccumulator]); // P1 gets current pile
        setPlayer2Hand([]); // P2 hand is confirmed empty
        setDraw([null, null]);
        return;
    }

    // --- Player 1 lays down face-down cards (ante) ---
    const p1FaceDown = [];
    for (let i = 0; i < warCardsToDraw; i++) {
        if (p1HandForWar.length > 1) { // Leave at least one card for face-up
            p1FaceDown.push(p1HandForWar.shift());
        } else {
            break; // Not enough cards to put more face down
        }
    }
    console.log(`P1 lays ${p1FaceDown.length} cards face down. P1 remaining for face-up: ${p1HandForWar.length}`);


    // --- Player 2 lays down face-down cards (ante) ---
    const p2FaceDown = [];
    for (let i = 0; i < warCardsToDraw; i++) {
        if (p2HandForWar.length > 1) { // Leave at least one card for face-up
            p2FaceDown.push(p2HandForWar.shift());
        } else {
            break;
        }
    }
    console.log(`P2 lays ${p2FaceDown.length} cards face down. P2 remaining for face-up: ${p2HandForWar.length}`);


    // Accumulate all cards currently in the pot (initial + all face-down)
    const currentSpoils = [...warPileAccumulator, ...p1FaceDown, ...p2FaceDown];
    console.log(`Spoils after face-down cards: ${currentSpoils.length}`);


    // --- Determine if players can play a face-up card ---
    const canP1PlayFaceUp = p1HandForWar.length > 0;
    const canP2PlayFaceUp = p2HandForWar.length > 0;

    if (!canP1PlayFaceUp && !canP2PlayFaceUp) {
        setMessage("War ends: Both players ran out of cards for face-up draw! Spoils divided or game ends (implementation specific). For now, Computer takes spoils by default if P1 is checked first.");
        // This is a rare state. A common rule is to add spoils to the next trick, or game draw.
        // For simplicity, if P1 can't, P2 gets them.
        setPlayer2Hand(prev => [...prev, ...currentSpoils]); // p2HandForWar is empty
        setPlayer1Hand(p1HandForWar); // p1HandForWar is empty
        setDraw([null,null]);
        return;
    }
    
    if (!canP1PlayFaceUp) {
        setMessage("Player 1 cannot play a face-up card in war! Computer wins the spoils.");
        setPlayer2Hand(prevHand => [...prevHand, ...currentSpoils]); // prevHand is p2HandForWar (which might be empty if it also ran out)
        setPlayer1Hand(p1HandForWar); // p1HandForWar is empty
        setDraw([null, canP2PlayFaceUp ? p2HandForWar[0] : null]); // Show P2's potential card
        // If P2 also couldn't play, p2HandForWar[0] would be undefined, handled by display logic.
        // Ensure p2HandForWar is updated if P2 also had no face-up card but wins due to P1's lack
        if (canP2PlayFaceUp) {
             setPlayer2Hand([...p2HandForWar, ...currentSpoils]); // P2 had cards, played one (implicitly)
        } else {
             setPlayer2Hand([...p2HandForWar, ...currentSpoils]); // P2 also out, but wins by P1 failing first
        }
        return;
    }

    if (!canP2PlayFaceUp) { // P1 could play (passed the first check), P2 cannot
        setMessage("Computer cannot play a face-up card in war! Player 1 wins the spoils.");
        // p1HandForWar is NOT empty here.
        setPlayer1Hand([...p1HandForWar, ...currentSpoils]);
        setPlayer2Hand(p2HandForWar); // p2HandForWar is empty
        setDraw([p1HandForWar.length > 0 ? p1HandForWar[0] : null, null]); // Show P1's winning card (it's still in p1HandForWar before shift)
                                                                    // Actually, p1WarUpCard is better here, defined below
        return;
    }

    // --- Both players can play a face-up card ---
    const p1WarUpCard = p1HandForWar.shift(); // Take card from hand
    const p2WarUpCard = p2HandForWar.shift(); // Take card from hand

    setDraw([p1WarUpCard, p2WarUpCard]); // Display the deciding war cards
    console.log(`P1 War Card: ${p1WarUpCard.id} (Rank ${p1WarUpCard.rank}), P2 War Card: ${p2WarUpCard.id} (Rank ${p2WarUpCard.rank})`);

    // Add these face-up cards to the total spoils for this war
    const totalSpoils = [...currentSpoils, p1WarUpCard, p2WarUpCard];
    console.log(`Total spoils in this war round: ${totalSpoils.length} cards`);

    if (p1WarUpCard.rank === p2WarUpCard.rank) {
        setMessage(`War Continues! Ranks are ${p1WarUpCard.rank}. Total Pile: ${totalSpoils.length}`);
        // Recursive call: pass the remaining hands (p1HandForWar, p2HandForWar are now after face-up draw)
        // and the accumulated spoils (totalSpoils)
        handleWar(p1HandForWar, p2HandForWar, setPlayer1Hand, setPlayer2Hand, setMessage, setDraw, totalSpoils);
    } else if (p1WarUpCard.rank > p2WarUpCard.rank) {
        setMessage(`Player 1 wins the war and ${totalSpoils.length} cards!`);
        // Player 1 gets their remaining hand plus all spoils (added to bottom)
        setPlayer1Hand([...p1HandForWar, ...totalSpoils]);
        // Player 2 gets their remaining hand
        setPlayer2Hand(p2HandForWar);
    } else { // p2WarUpCard.rank > p1WarUpCard.rank
        setMessage(`Computer wins the war and ${totalSpoils.length} cards!`);
        setPlayer2Hand([...p2HandForWar, ...totalSpoils]);
        setPlayer1Hand(p1HandForWar);
    }
};


const play = (player1Hand, player2Hand, setMessage, setDraw, setPlayer1Hand, setPlayer2Hand) => {
    // Check for game over conditions (no cards left)
    if (player1Hand.length === 0 && player2Hand.length === 0) {
        setMessage("Game Over! It's a tie (both out of cards).");
        return;
    }
    if (player1Hand.length === 0) {
        setMessage("Player 1 has no cards! Computer wins the game!");
        return;
    }
    if (player2Hand.length === 0) {
        setMessage("Computer has no cards! Player 1 wins the game!");
        return;
    }

    const p1Draw = player1Hand[0];
    const p2Draw = player2Hand[0];

    setDraw([p1Draw, p2Draw]); // Display the cards being played

    // Hands after these top cards are notionally played (they will be removed or re-added)
    const nextP1Hand = player1Hand.slice(1);
    const nextP2Hand = player2Hand.slice(1);

    const player1rank = p1Draw.rank;
    const player2rank = p2Draw.rank;

    if (player1rank === player2rank) {
        setMessage("War!");
        // These are the cards that caused the war; they start the war pile.
        const initialWarPile = [p1Draw, p2Draw];
        // Call handleWar with the hands *after* these initial cards are removed,
        // plus setters, and the initial pile.
        handleWar(nextP1Hand, nextP2Hand, setPlayer1Hand, setPlayer2Hand, setMessage, setDraw, initialWarPile);
    } else if (player1rank > player2rank) {
        setMessage("Player 1 Wins Round!");
        // Player 1 gets their played card (p1Draw) and the opponent's card (p2Draw), added to the bottom of their remaining hand.
        setPlayer1Hand([...nextP1Hand, p1Draw, p2Draw]);
        setPlayer2Hand(nextP2Hand); // Player 2 loses their card
    } else { // player1rank < player2rank
        setMessage("Computer Wins Round!");
        setPlayer2Hand([...nextP2Hand, p1Draw, p2Draw]);
        setPlayer1Hand(nextP1Hand);
    }
};

function War() {

    const [deck, setDeck]=useState(initialDeck)
    const [shuffleDeck, setShuffleDeck]=useState([])
    const [player1Hand, setPlayer1Hand]=useState([])
    const [player2Hand, setPlayer2Hand]=useState([])
    const [message, setMessage]=useState("Press Draw to Continue")
    const [draw, setDraw]=useState()



    useEffect(()=>{
        shuffle(deck, setShuffleDeck)
    },[])

    useEffect(()=>{
        deal(shuffleDeck, player1Hand, player2Hand,setPlayer1Hand,setPlayer2Hand)
    },[shuffleDeck])



    


  
    return (
        <div className='war_Canvas'>
            <div>Remaining Cards:{player2Hand.length}</div>
            <div>{message}</div>
            {/* Opponent's Card Display Area */}
            <div className="card-slot opponent-card-slot">
                {draw && draw[1] && draw[1].imageFileName && cardImageModules[draw[1].imageFileName] ? (
                    <img
                        src={cardImageModules[draw[1].imageFileName]} // Use the imported module
                        alt={draw[1].value && draw[1].suit ? `${draw[1].value} of ${draw[1].suit}` : 'Opponent card'}
                        className="card-image"
                    />
                ) : (
                    <img
                        src={cardImageModules['card_back.png']} // Use imported card back
                        alt="Opponent card slot"
                        className="card-image"
                    />
                )}
            </div>

            {/* Player's Card Display Area */}
            <div className="card-slot player-card-slot">
                {draw && draw[0] && draw[0].imageFileName && cardImageModules[draw[0].imageFileName] ? (
                    <img
                        src={cardImageModules[draw[0].imageFileName]} // Use the imported module
                        alt={draw[0].value && draw[0].suit ? `${draw[0].value} of ${draw[0].suit}` : 'Player card'}
                        className="card-image"
                    />
                ) : (
                    <img
                        src={cardImageModules['card_back.png']} // Use imported card back
                        alt="Player card slot"
                        className="card-image"
                    />
                )}
            </div>
            <div>Remaining Cards:{player1Hand.length}</div>    
            <button 
                type="button" 
                className='btn btn-success war_control' 
                onClick={() => play(
                    player1Hand, 
                    player2Hand,
                    setMessage,
                    setDraw,
                    setPlayer1Hand,
                    setPlayer2Hand
                    // No need to pass handleWar explicitly if it's in the same scope and play calls it directly
                )}
                disabled={player1Hand.length === 0 || player2Hand.length === 0} // Optional: disable button if game is over
            >
                Draw
            </button>
        </div>
    );
}

export default War