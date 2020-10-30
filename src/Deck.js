import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const API_URL = "https://deckofcardsapi.com/api/deck"

const Deck = () => {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([])
    const [autoDraw, setAutoDraw] = useState(false)
    const timerRef = useRef(null)
    
    useEffect(() => {
        const getData = async () => {
            let deck = await axios.get(`${API_URL}/new/shuffle/?deck_count=1`)
            setDeck(deck.data)
        }
        getData()
    }, [setDeck])

    useEffect(() => {
        const getCard = async () => {
            let {deck_id} = deck

            try{
                let draw = await axios.get(`${API_URL}/${deck_id}/draw/`)

                if(draw.data.remaining === 0) {
                    setAutoDraw(false)
                    throw new Error("No more cards")
                }

                const card = draw.data.cards[0]

                setDrawn(d => [
                    ...d,
                    {
                        id: card.code,
                        name: card.suit + " " + card.value,
                        image: card.image
                    }
                ]);
            }catch(e){
                setAutoDraw(false)
                alert(e)
            }
        }

        if(autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000)
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null
        }

    },[autoDraw, setAutoDraw, deck])

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto)
    }

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));

    return (
        <div className="Deck">
            {deck ? (
                <button className="Deck-button" onClick={toggleAutoDraw}>{autoDraw ? "STOP" : "START"} DRAWING FOR ME!</button>
            ) : null}
            <div className="Deck-cardContainer">{cards}</div>
        </div>
    )
}

export default Deck