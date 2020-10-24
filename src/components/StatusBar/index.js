import React, {useContext} from 'react';
import { sharedMVContext } from '../../global/AppContext';
import { Cesium } from '../../global/constant';

import './style.css';

let projectionPicker = undefined;
export default function StatusBar() {
    const { mapView } = useContext(sharedMVContext);
    const _getProjection = () => {
        if (mapView && !projectionPicker) {
            projectionPicker = new Cesium.ProjectionPicker("projection-picker", mapView.viewer.scene);
        }
    }

    return (
        <div className="status-bar">
            <div className="elevation-label-layout status-common-margin">
                <p className="status-bar-text" id="elevation-label"> Elevation: Calculating... </p>
            </div>

            <div className="coordinates-label-layout status-common-margin">
                <p className="status-bar-text" id="coordinate-label"> Longitude/Latitude </p>
            </div>

            <div className="datum-label-layout status-common-margin" onClick={_getProjection}>
                <p className="status-bar-text" id="datum-label"> Projection: WGS84 </p>
            </div>
        </div>
    );
}