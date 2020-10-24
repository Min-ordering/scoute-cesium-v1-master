import React from 'react';
import * as Utils from "../../rest/util";
import DTM from './DTM';
import MODEL3D from './Model3D';
import Orthomosaic from './Orthomosaic';
import './style.css';

export default function EachLayer(props) {
	function initUI() {
		const uiElements = [];
		props.assets.map((asset, index) => {
			const createdDate = asset.ion_created_date;
			if (asset.layer_type === "Orthomosaic") {
				uiElements.push(
					<div className="layer-box" key={index}>
						<div className="layer-milestone">
							<div className="milestone-top-circle" />
							<div className="milestone-bottom-circle" />
						</div>
						<div style={{ position: 'relative' }}>
						<Orthomosaic asset={asset} key={index} />
							<p className="project-name">{Utils.formatDateString(createdDate)}</p>
						</div>
					</div>
				);
			}
			else if (asset.layer_type === "DTM") {
				uiElements.push(
					<div className="layer-box" key={index}>
						<div className="layer-milestone">
							<div className="milestone-top-circle" />
							<div className="milestone-bottom-circle" />
						</div>
						<div style={{ position: 'relative' }}>
							<DTM asset={asset} key={index} />
							<p className="project-name">{Utils.formatDateString(createdDate)}</p>
						</div>
					</div>
				);
			} 
			else if (asset.layer_type === "3DModel" || asset.layer_type === "PointCloud") {
				uiElements.push(
					<div className="layer-box" key={index}>
						<div className="layer-milestone">
							<div className="milestone-top-circle" />
							<div className="milestone-bottom-circle" />
						</div>
						<div style={{ position: 'relative' }}>
							<MODEL3D asset={asset} />
							<p className="project-name">{Utils.formatDateString(createdDate)}</p>
						</div>
					</div>
				);
			}
		});

		return uiElements;
	}

	return (
		<div className="layers-view">
			{initUI()}
		</div>
	);
}