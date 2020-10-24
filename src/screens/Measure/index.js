import React, { useContext, useEffect, useRef } from "react";
import BottomBar from "../../components/BottomBar";
import { setToolbarsVisibility } from "../../rest/util";
import { mapStoreContext, sharedMVContext } from "../../global/AppContext";
import Toolbar from "./Toolbar";
import { projectActionCreators } from "../../store/project/actions";
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Cesium } from '../../global/constant';
import * as Utils from '../../rest/util';
import * as MoveHandlerUtils from './MouseMoveUtils';
import * as LeftClickHandlerUtils from './MoustLeftClickUtils';

import './style.css';

let mouseHandler = undefined, floatingLine = undefined;
let linePointsArray = [], drawingLinePointsArray = []; // line array which includes current drawing line

function Measure(props) {
	const mapStoreCtx = useContext(mapStoreContext);
	const mapViewerCtx = useContext(sharedMVContext);

	const selectedToolIndex = useRef(props.selectedToolIndex);

	useEffect(() => {
		setToolbarsVisibility(true);
	}, []);

	useEffect(() => {
		selectedToolIndex.current = props.selectedToolIndex;
	}, [props.selectedToolIndex]);

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
			console.log("ZEDEX: Measure Component Will Unmount!");
			document.body.style.cursor = 'auto';
			if (mouseHandler) {
				mouseHandler.destroy();
				mouseHandler = undefined;
			}
			if (floatingLine) {
				mapViewerCtx.mapView.viewer.entities.remove(floatingLine);
				floatingLine = undefined;
			}

			linePointsArray = [];
			drawingLinePointsArray = [];
		};
	}, [mapViewerCtx]);

	useEffect(() => {
		if (mapStoreCtx && mapStoreCtx.data) {
			_updateMeasureBlock(mapStoreCtx.data.annotations);
		}
	}, [mapStoreCtx]);

	const _updateMeasureBlock = (annotations) => {

	}

	const _mouseMoveAction = (movement) => {
		const hoveredMarkers = Utils.pickAnnotations(mapViewerCtx.mapView.viewer, movement.endPosition);

		if (hoveredMarkers.length > 0) {
			document.body.style.cursor = "pointer";
		} else {
			document.body.style.cursor = "crosshair";
		}

		const floatingPoint = Utils.getGlobePositionWithTerrain(mapViewerCtx.mapView.viewer, movement.endPosition);
		if (!floatingPoint) return;

		switch (selectedToolIndex.current) {
			case 1:
				if (!drawingLinePointsArray.length) return;
				if (drawingLinePointsArray.length === 1) {
					drawingLinePointsArray.push(floatingPoint);
				} else {
					drawingLinePointsArray.pop();
					drawingLinePointsArray.push(floatingPoint);					
				}
				floatingLine = MoveHandlerUtils.horizontalLineMouseMoveAction(mapViewerCtx.mapView.viewer, drawingLinePointsArray, "active_line");
				break;
			case 2:
				MoveHandlerUtils.verticalLineMouseMoveAction();
				break;
			case 3:
				MoveHandlerUtils.polygonMouseMoveAction();
				break;
			case 4:
				MoveHandlerUtils.slopeLineMouseMoveAction();
				break;
			case 5:
				MoveHandlerUtils.angleLineMouseMoveAction();
				break;
			default:
				break;
		}
	}

	const _mouseLeftButtonClickAction = (event) => {
		const globePosition = Utils.getGlobePositionWithTerrain(mapViewerCtx.mapView.viewer, event.position);
		if (!globePosition) return;

		switch (selectedToolIndex.current) {
			case 1:
				drawingLinePointsArray.push(globePosition);
				LeftClickHandlerUtils.horizontalLineLeftClickAction(mapViewerCtx.mapView.viewer, globePosition, linePointsArray);
				break;
			case 2:
				LeftClickHandlerUtils.verticalLineLeftClickAction();
				break;
			case 3:
				LeftClickHandlerUtils.polygonLineLeftClickAction();
				break;
			case 4:
				LeftClickHandlerUtils.slopeLineLeftClickAction();
				break;
			case 5:
				LeftClickHandlerUtils.angleLineLeftClickAction();
				break;
			default:
				break;
		}
	}

	return (
		<div className="sidebar">
			<Toolbar selectedToolIndex={props.selectedToolIndex} setSelectedToolIndex={props.setSelectedToolIndex} />
			<div className="value-display-box">
				<p className="measure-label">Horizontal Distance: </p>
				<p className="measure-value">129.87 m</p>

				<p className="measure-label">Vertical Distance: </p>
				<p className="measure-value">129.87 m</p>

				<p className="measure-label">Area: </p>
				<p className="measure-value">11229.87 m2</p>

				<p className="measure-label">Slope Angle: </p>
				<p className="measure-value">128 degree</p>

				<p className="measure-label">Slope Distance: </p>
				<p className="measure-value">981 m</p>

				<p className="measure-label">Bearing: </p>
				<p className="measure-value">65 degree</p>
			</div>
			<BottomBar />
		</div>
	);
}

const mapStateToProps = state => ({
	isProjectLoaded: state.project.isProjectLoaded,
	projects: state.project.projects,
	assets: state.project.assets,
	annotations: state.project.annotations,
	selectedToolIndex: state.project.selectedToolIndex,
	setSelectedToolIndex: state.project.setSelectedToolIndex
});

Measure.propTypes = {
	isProjectLoaded: PropTypes.bool.isRequired,
	projects: PropTypes.array.isRequired,
	assets: PropTypes.array.isRequired,
	annotations: PropTypes.array.isRequired,
	selectedToolIndex: PropTypes.number.isRequired,
	setSelectedToolIndex: PropTypes.func.isRequired
}

export default compose(
	withRouter,
	connect(mapStateToProps, projectActionCreators)
)(Measure);