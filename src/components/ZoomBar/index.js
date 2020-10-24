import React, { useContext } from 'react';
import { sharedMVContext } from '../../global/AppContext';
import * as Utils from '../../rest/util';
import './style.css';

export default function ZoomBar() {
    const mapViewCtx = useContext(sharedMVContext);
    const viewer = mapViewCtx.mapView.viewer;

    function _zoomInClicked() {
        if (!viewer) return;
        Utils.animationZoom(viewer, 0.5);
    }
    function _zoomOutClicked() {
        if (!viewer) return;
        Utils.animationZoom(viewer, 2);
    }
    function _resetCameraFocus() {
        if (!viewer) return;
        Utils.cameraResetTilt(viewer, viewer.camera.heading, -Math.PI / 2, viewer.camera.roll);
    }

    return (
        <div className="zoom-bar">
            <div className="zoom-button plus" onClick={() => _zoomInClicked()}>
                <svg width="40" height="40" viewBox="0 0 24 24" className="zoom-icon-svg">
                    <path fill="#555" d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z" />
                </svg>
            </div>
            <div className="zoom-button minus" onClick={() => _zoomOutClicked()}>
                <svg width="40" height="40" viewBox="0 0 24 24" className="zoom-icon-svg">
                    <path fill="#555" d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z" />
                </svg>
            </div>
            <div className="zoom-button inspect" onClick={() => _resetCameraFocus()}>
                <svg width="40" height="40" viewBox="0 0 24 24" className="zoom-icon-svg">
                    <path fill="#555" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M19,19H15V21H19A2,2 0 0,0 21,19V15H19M19,3H15V5H19V9H21V5A2,2 0 0,0 19,3M5,5H9V3H5A2,2 0 0,0 3,5V9H5M5,15H3V19A2,2 0 0,0 5,21H9V19H5V15Z" />
                </svg>
            </div>
        </div>
    );
}