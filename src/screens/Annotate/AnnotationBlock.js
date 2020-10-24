import React, { useState, useContext, useEffect } from 'react';
import { Cesium } from '../../global/constant';
import * as Utils from '../../rest/util';
import { mapStoreContext } from '../../global/AppContext';
import { Conversation } from '../../global/MapStore';
import Comment from './Comment';

import './style.css';

export default function AnnotationBlock({ annotation }) {
    const _cartoPos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(annotation.entity._position._value);
    const mapStoreCtx = useContext(mapStoreContext);
    const [thought, setThought] = useState("");
    const [uiCommentsElems, setUICommentsElems] = useState([]);

    useEffect(() => {
        _getComments(annotation);
    }, []);

    const _getComments = (_annotation) => {
        if (!_annotation.conversations.length) return null;

        const _uiComments = [];
        let i = 0;
        for (const _comment of _annotation.conversations) {
            _uiComments.push(
                <Comment name={_comment.author} comment={_comment.content} date={_comment.created} key={i} />
            );
            i++;
        }

        setUICommentsElems(
            <div className="comments-box">
                <p className="comments-title">Comments: </p>
                {_uiComments}
            </div>
        );
    }

    const _addComment = () => {
        const _createdDate = Utils.formatDateString(new Date());
        if (mapStoreCtx.data) {
            const _comment = new Conversation();
            _comment.content = thought;
            _comment.created = _createdDate;
            _comment.author = "Patrick Weeden";
            mapStoreCtx.updateComments(annotation.id, _comment);

            _getComments(mapStoreCtx.data.annotations[annotation.id]);
            setThought("");
        }
    }

    const _navigateToMarker = () => {

    }

    const _getUserIcon = () => {
        const firstname = "Patrick"; const lastname = "Weeden";

        return (
            <div className="user-icon">
                {`${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`}
            </div>
        );
    }

    return (
        <div className="annotation-view">
            <svg className="annotation-icon" xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                onClick={_navigateToMarker}
            >
                <path fill={annotation.color} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>

            <div className="annotation-body">
                <p className="annotation-name" style={{ color: annotation.color }}>{annotation.name}</p>
                <p className="coordinate-text"><b>Latitude:</b> {_cartoPos.latitude.toFixed(6)}</p>
                <p className="coordinate-text"><b>Longitude:</b> {_cartoPos.longitude.toFixed(6)}</p>
                <div className="add-comment-layout">
                    {/* <button className="add-comment-btn" onClick={() => setShowComment(true)}>Add Comment</button> */}
                    <div className="add-comment-box">
                        {_getUserIcon()}
                        <input className="thought-input"
                            type="text"
                            placeholder="Enter your thoughts here.."
                            value={thought}
                            onChange={(evt) => setThought(evt.target.value)}
                        />
                        <button className="thought-post-btn" onClick={_addComment}>Post</button>
                    </div>
                </div>
                {uiCommentsElems}
            </div>
        </div>
    );
}
