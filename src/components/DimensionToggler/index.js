import React, { useState, useContext } from 'react';
import { sharedMVContext } from '../../global/AppContext';
import { Cesium } from '../../global/constant';
import * as Utils from '../../rest/util';
import './style.css';

export default function DimensionToggler() {
    const mapViewCtx = useContext(sharedMVContext);
    const viewer = mapViewCtx.mapView.viewer;
    
    const [selected, setSelected] = useState(2);

    function _toggle2D() {
        Utils.cameraReset3D(viewer, 0, new Cesium.HeadingPitchRange(0, -Math.PI / 2, viewer.camera.positionCartographic.height / Math.sqrt(2)));
        Utils.enableTiltCesium(viewer, false);
    }

    function _toggle3D() {
        Utils.cameraReset3D(viewer, 0, new Cesium.HeadingPitchRange(0, -Math.PI / 4, viewer.camera.positionCartographic.height / Math.sqrt(2)));
        Utils.enableTiltCesium(viewer, true);
    }

    return (
        <div className="dimension-toggler">
            <div className="toggler-label left"
                style={{ background: selected === 1 ? 'rgba(2, 35, 63, 1)' : 'transparent' }}
                onClick={() => {
                    setSelected(1);
                    _toggle2D();
                }}>
                <p style={{ margin: 0, fontWeight: 600, marginTop: 6, color: selected === 1 ? 'white' : 'rgba(2, 35, 63, 1)' }}>2D</p>
            </div>
            <div className="toggler-label right"
                style={{ background: selected === 2 ? 'rgba(2, 35, 63, 1)' : 'transparent' }}
                onClick={() => {
                    setSelected(2);
                    _toggle3D();
                }}>
                <p style={{ margin: 0, fontWeight: 600, marginTop: 6, color: selected === 2 ? 'white' : 'rgba(2, 35, 63, 1)' }}>3D</p>
            </div>
        </div>
    );
}