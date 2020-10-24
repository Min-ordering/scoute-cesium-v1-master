import React, { useState } from 'react';

import './style.css';

export default function Toolbar(props) {
    const [selectedIndex, setSelectedIndex] = useState(props.selectedToolIndex);

    const _toolButtonClicked = (evt, index) => {
        setSelectedIndex(index);
        props.setSelectedToolIndex(index);
    }

    return (
        <div className="measure-tool-box">
            <div className="measure-tool"
                onClick={(evt) => _toolButtonClicked(evt, 1)}
                style={selectedIndex === 1 ? { backgroundColor: '#315f88' } : {}}
            >
                <svg className="annotation-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="white" d="M6.45,17.45L1,12L6.45,6.55L7.86,7.96L4.83,11H19.17L16.14,7.96L17.55,6.55L23,12L17.55,17.45L16.14,16.04L19.17,13H4.83L7.86,16.04L6.45,17.45Z" />
                </svg>
            </div>
            <div className="measure-tool"
                onClick={(evt) => _toolButtonClicked(evt, 2)}
                style={selectedIndex === 2 ? { backgroundColor: '#315f88' } : {}}
            >
                <svg className="annotation-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="white" d="M10,8H6L12,2L18,8H14V16H18L12,22L6,16H10V8Z" />
                </svg>
            </div>
            <div className="measure-tool"
                onClick={(evt) => _toolButtonClicked(evt, 3)}
                style={selectedIndex === 3 ? { backgroundColor: '#315f88' } : {}}
            >
                <svg className="annotation-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="white" d="M18,18H6V6H18M18,4H6A2,2 0 0,0 4,6V18A2,2 0 0,0 6,20H18A2,2 0 0,0 20,18V6C20,4.89 19.1,4 18,4Z" />
                </svg>
            </div>
            <div className="measure-tool"
                onClick={(evt) => _toolButtonClicked(evt, 4)}
                style={selectedIndex === 4 ? { backgroundColor: '#315f88' } : {}}
            >
                <svg className="annotation-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="white" d="M22,19V22H2V13L22,19M19.09,7.5L18.25,10.26L8.13,7.26C8.06,5.66 6.7,4.42 5.1,4.5C3.5,4.57 2.26,5.93 2.34,7.53C2.41,9.13 3.77,10.36 5.37,10.29C6.24,10.25 7.05,9.82 7.57,9.11L17.69,12.11L16.85,14.89L21.67,12.29L19.09,7.5Z" />
                </svg>
            </div>
            <div className="measure-tool"
                onClick={(evt) => _toolButtonClicked(evt, 5)}
                style={selectedIndex === 5 ? { backgroundColor: '#315f88' } : {}}
            >
                <svg className="annotation-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="white" d="M20,19H4.09L14.18,4.43L15.82,5.57L11.28,12.13C12.89,12.96 14,14.62 14,16.54C14,16.7 14,16.85 13.97,17H20V19M7.91,17H11.96C12,16.85 12,16.7 12,16.54C12,15.28 11.24,14.22 10.14,13.78L7.91,17Z" />
                </svg>
            </div>
        </div>
    );
}