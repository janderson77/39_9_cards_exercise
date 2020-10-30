import React, { useState } from "react";
import './Card.css'

const Card = ({name, image}) => {
    return <img alt={name} src={image} className="Card" />
}

export default Card