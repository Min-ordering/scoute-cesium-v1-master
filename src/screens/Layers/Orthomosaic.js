import React, {useContext, useState} from 'react';
import { SERVER_STORAGE_URL } from "../../global/constant";
import { mapStoreContext, sharedMVContext } from '../../global/AppContext';

import './style.css';

const eye = "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z";
const blind = "M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z";

export default function Orthomosaic({ asset }) {
    const mapStoreCtx = useContext(mapStoreContext);
    const mapViewerCtx = useContext(sharedMVContext);

    const [eyeIcon, setEyeIcon] = useState(eye);

	function toggleModel() {
        const visible = mapStoreCtx.data.projects[asset.project_id].assets[asset.tile_url].entity.show;
        mapStoreCtx.data.projects[asset.project_id].assets[asset.tile_url].entity.show = !visible;
        setEyeIcon(visible ? blind : eye);
	}

    function navigateToModel() {
        if (mapViewerCtx.mapView.viewer) {
            const tileset = mapStoreCtx.data.projects[asset.project_id].assets[asset.tile_url].entity;
            mapViewerCtx.mapView.viewer.flyTo(tileset);
        }
    }

	return (
		<div className="overview-box">
			<img className="small-overview" src={`${SERVER_STORAGE_URL}/${asset.preview_image}`} alt="orthomosaic" onClick={() => navigateToModel()} />
			<svg width="24" height="24" viewBox="0 0 24 24" className="overview-visible" style={{ cursor: 'pointer' }} onClick={() => toggleModel()}>
				<path fill="#000" d={eyeIcon} />
			</svg>
			<p className="overview-text">Orthomosaic</p>
		</div>
	);
}