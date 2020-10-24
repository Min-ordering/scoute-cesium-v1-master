import React from 'react';
import './style.css';

export default function ColorBadge(props) {
    const _onMouseClick = () => {
        props.setBorderStyle(props.color, `2px solid ${props.color}`);
    }

    return (
        <div className="color-view-container">
            <div className="color-view" style={{ backgroundColor: props.color, border: props.border }} onClick={_onMouseClick} />
        </div>
    );
}