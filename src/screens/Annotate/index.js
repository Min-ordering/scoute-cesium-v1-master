import React, { useContext, useEffect, useRef, useState } from "react";
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import BottomBar from "../../components/BottomBar";
import AnnotationBlock from './AnnotationBlock';

import { setToolbarsVisibility } from "../../rest/util";
import { Cesium } from '../../global/constant';
import { mapStoreContext, sharedMVContext } from "../../global/AppContext";
import * as Utils from '../../rest/util';
import ColorBadge from './ColorBadge';
import { projectActionCreators } from "../../store/project/actions";

import './style.css';
let mouseHandler = undefined, floatingMarker = undefined;

function Annotate(props) {
	const annotationNames = [];
	const annotationColors = ['#f50207', '#e29544', '#8dc63e', '#30aae3', '#5f3876', '#666466'];
	const initialBorder = {}; initialBorder[props.highlightedColor] = `2px solid ${props.highlightedColor}`;

	const mapStoreCtx = useContext(mapStoreContext);
	const mapViewerCtx = useContext(sharedMVContext);

	const markerName = useRef("Marker 1");
	const highlightedColor = useRef(props.highlightedColor);

	const [borders, setBorders] = useState(initialBorder);
	const [uiAnnotations, setUIAnnotations] = useState([]);

	useEffect(() => {
		setToolbarsVisibility(true);

		const existingMarkerNames = Object.keys(mapStoreCtx.data.annotations);
		for (let i = 0; i < existingMarkerNames.length; i++) {
			annotationNames.push(existingMarkerNames[i]);
		}
	}, []);

	useEffect(() => {
		if (mapViewerCtx.mapView && mapViewerCtx.mapView.viewer && !mouseHandler) {
			mouseHandler = new Cesium.ScreenSpaceEventHandler(mapViewerCtx.mapView.viewer.scene.canvas);

			mouseHandler.setInputAction(function (movement) {
				_mouseMoveAction(movement);
			}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			mouseHandler.setInputAction(function (event) {
				_mouseLeftButtonClickAction(event);
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		}

		return () => {
			console.log("ZEDEX: Annotation Component Will Unmount!");
			document.body.style.cursor = 'auto';
			if (mouseHandler) {
				mouseHandler.destroy();
				mouseHandler = undefined;
			}

			if (floatingMarker) {
				mapViewerCtx.mapView.viewer.entities.remove(floatingMarker);
				floatingMarker = undefined;
			}
		};
	}, [mapViewerCtx]);

	useEffect(() => {
		if (mapStoreCtx && mapStoreCtx.data) {
			_updateAnnoationsBlock(mapStoreCtx.data.annotations);
		}
	}, [mapStoreCtx]);

	const _setBorderStyle = (key, style) => {
		const newBorders = {};
		newBorders[key] = style;
		setBorders(newBorders);

		highlightedColor.current = key;

		// update redux variable
		props.setHighlightedColor(key);

		if (floatingMarker) {
			const image = Utils.generateMarkerImage(highlightedColor.current, false);
			floatingMarker._billboard._image.setValue(image);
		}
	}

	const _mouseMoveAction = (movement) => {
		const endPosition = movement.endPosition;
		if (!endPosition) {
			document.body.style.cursor = 'auto';
			return;
		}

		const hoveredMarkers = Utils.pickAnnotations(mapViewerCtx.mapView.viewer, movement.endPosition);
		if (hoveredMarkers.length > 0) {
			document.body.style.cursor = "pointer";
			mapViewerCtx.mapView.viewer.entities.remove(floatingMarker);
			floatingMarker = undefined;
			return;
		} else {
			document.body.style.cursor = "crosshair";
		}

		_drawMarkerOnMove(endPosition);
	}

	const _drawMarkerOnMove = (windowPosition) => {
		let point = Utils.getGlobePositionWithTerrain(mapViewerCtx.mapView.viewer, windowPosition);
		if (!point) return null;

		_getAvailableMarkerName();

		const image = Utils.generateMarkerImage(highlightedColor.current, false);

		if (!floatingMarker) {
			floatingMarker = mapViewerCtx.mapView.viewer.entities.add({
				position: Cesium.Cartesian3.fromRadians(point.longitude, point.latitude, point.height),
				billboard: {
					image: image,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
				},
				label: {
					text: markerName.current,
					font: '10pt bold Helvetica',
					fillColor: Cesium.Color.BLACK,
					outlineColor: Cesium.Color.WHITE,
					outlineWidth: 5,
					style: Cesium.LabelStyle.FILL_AND_OUTLINE,
					pixelOffset: new Cesium.Cartesian3(0, 10),
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
				},
				id: markerName.current,
			});
		} else {
			floatingMarker._position._value = Cesium.Cartesian3.fromRadians(point.longitude, point.latitude, point.height);
			floatingMarker._billboard._image.setValue(image);
			floatingMarker._show = true;
		}
	}

	const _mouseLeftButtonClickAction = (event) => {
		if (!floatingMarker) return;

		mapStoreCtx.updateAnnotations(markerName.current, floatingMarker, "marker", highlightedColor.current);
		floatingMarker = undefined;
		annotationNames.push(markerName.current);

		//update UI
		_updateAnnoationsBlock(mapStoreCtx.data.annotations);
	};

	const _getAvailableMarkerName = () => {
		for (let i = 1; i < 10000; i++) {
			if (annotationNames.indexOf(`Marker ${i}`) < 0) {
				markerName.current = `Marker ${i}`;
				break;
			}
		}
	}

	const _updateAnnoationsBlock = (annotations) => {
		if (!annotations) {
			setUIAnnotations([]);
			return;
		}
		const _keys = Object.keys(annotations);
		const _uiAnnotations = [];

		for (const _key of _keys) {
			_uiAnnotations.push(
				<AnnotationBlock annotation={annotations[_key]} key={_key} />
			)
		}

		setUIAnnotations(_uiAnnotations);
	}

	return (
		<div className="sidebar">
			<div className="color-select-tool">
				<ColorBadge color={annotationColors[0]} border={borders[annotationColors[0]]} setBorderStyle={_setBorderStyle} />
				<ColorBadge color={annotationColors[1]} border={borders[annotationColors[1]]} setBorderStyle={_setBorderStyle} />
				<ColorBadge color={annotationColors[2]} border={borders[annotationColors[2]]} setBorderStyle={_setBorderStyle} />
				<ColorBadge color={annotationColors[3]} border={borders[annotationColors[3]]} setBorderStyle={_setBorderStyle} />
				<ColorBadge color={annotationColors[4]} border={borders[annotationColors[4]]} setBorderStyle={_setBorderStyle} />
				<ColorBadge color={annotationColors[5]} border={borders[annotationColors[5]]} setBorderStyle={_setBorderStyle} />
			</div>
			<div className="annotation-container">
				{uiAnnotations}
			</div>
			<BottomBar />
		</div>
	);
}

const mapStateToProps = state => ({
	highlightedColor: state.project.highlightedColor,
	setHighlightedColor: state.project.setHighlightedColor
});

Annotate.propTypes = {
	highlightedColor: PropTypes.string.isRequired,
	setHighlightedColor: PropTypes.func.isRequired
}

export default compose(
	withRouter,
	connect(mapStateToProps, projectActionCreators)
)(Annotate);
