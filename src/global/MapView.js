import { Viewer, createWorldTerrain } from "cesium/Cesium";
import { Cesium } from '../global/constant';
import * as Utils from '../rest/util';

let sharedViewer = {};

export default class MapView {
	constructor() {
		Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxOGEwZGFjOS0yMjNlLTQyMTQtODU3Mi1kNWU5M2FmYmE0YTkiLCJpZCI6MTE5OTUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjAyMDc5OTJ9.iDosftSqW8l_R4hEy5AHnlLNMbv5WGXqqdK-DiF9dBc";
		this.createElement();
		this.viewer = {};
		this.initViewer();
		this.setupEvents();
	}

	createElement() {
		const cesiumDiv = document.createElement('div');
		cesiumDiv.id = 'cesium-content';
		cesiumDiv.className = 'viewer-cesium-content';
		document.getElementById('cesiumContainer').appendChild(cesiumDiv);
	}

	initViewer() {
		this.viewer = new Viewer('cesium-content', {
			baseLayerPicker: false,
			geocoder: false,
			sceneModePicker: false,
			homeButton: false,
			animation: false,
			infoBox: false,
			navigationHelpButton: false,
			fullscreenButton: false,
			useDefaultRenderLoop: true,
			timeline: false,
			selectionIndicator: false,
			terrainProvider: createWorldTerrain({
				requestWaterMask: true,
				requestVertexNormals: true
			})
		});

		this.viewer.is2D = false;
		this.viewer.morphTime = 1.0;
		this.viewer.scene.globe.depthTestAgainstTerrain = false;

		sharedViewer = this.viewer;
	}

	setupEvents() {
		const mouseHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

		mouseHandler.setInputAction(function (movement) {
			mouseMoveAction(movement);
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	}
}

function mouseMoveAction(movement) {
	const endPosition = movement.endPosition;
	if (!endPosition) return;

	const position = Utils.getGlobePositionWithTerrain(sharedViewer, endPosition);
	if (!position) return;

	const lon = Cesium.Math.toDegrees(position.longitude);
	const lat = Cesium.Math.toDegrees(position.latitude);
	const height = position.height;
	document.getElementById("coordinate-label").innerHTML = `${lon.toFixed(5)}/${lat.toFixed(5)}`;
	document.getElementById("elevation-label").innerHTML = `Elevation: ${height.toFixed(2)}m`;
}