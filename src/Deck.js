import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const API_URL = "https://deckofcardsapi.com/api/deck"

const Deck = () => {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([])
    
    useEffect(() => {
        const getData = async () => {
            let deck = await axios.get(`${API_URL}/new/shuffle/?deck_count=1`)
            setDeck(deck.data)
        }
        getData()
    }, [setDeck])

    const getCard = async () => {
        let {deck_id} = deck

        try{
            console.log()
            let draw = await axios.get(`${API_URL}/${deck_id}/draw/`)

            if(draw.data.remaining === 0) {
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
        }catch(e){alert(e)}
    }

    useEffect(() => {
        const getCard = async () => {
            let {deckId} = deck

            try{
                let draw = await axios.get(`${API_URL}/${deckId}/draw/`)

                if(draw.data.remaining === 0) {
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
            }catch(e){alert(e)}
        }
    },[deck])

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));

    return (
        <div className="Deck">
            {deck ? (
                <button className="Deck-button" onClick={getCard}>Gimme!</button>
            ) : null}
            <div className="Deck-cardContainer">{cards}</div>
        </div>
    )
}

export default Deck