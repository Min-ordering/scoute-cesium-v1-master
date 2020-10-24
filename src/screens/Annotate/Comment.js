import React from 'react';
import './style.css';

export default function Comment(props) {
	return (
		<div className="each-comment-view">
			<div className="comment-content">
				<p className="commentor">{props.name}: </p>
				<p className="comment-text">{props.comment} </p>
			</div>
			<p className="comment-date">{props.date}</p>
		</div>
	);
}