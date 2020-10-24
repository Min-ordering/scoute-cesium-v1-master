import React, { useContext, useEffect } from "react";
import BottomBar from "../../components/BottomBar";
import { sharedMVContext, mapStoreContext } from '../../global/AppContext';
import * as Utils from "../../rest/util";
import { projectActionCreators } from "../../store/project/actions";
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { promisify } from '../../rest/promisify';
import { Cesium } from '../../global/constant';
import { Project, Asset, Annotation, Conversation } from "../../global/MapStore";
import TreeView from './Treeview';
import { LAYER_TYPES } from '../../global/constant';

import './style.css';

function Layers(props) {
	const mapViewerCtx = useContext(sharedMVContext);
	const mapStoreCtx = useContext(mapStoreContext);
	const loggedInEmail = localStorage.getItem("zedex2020/email", 'patrick@scoutaerial.com.au');

	useEffect(() => {
		Utils.setToolbarsVisibility(true);
	}, []);

	useEffect(() => {
		if (mapViewerCtx.mapView && mapViewerCtx.mapView.viewer) {
			!props.isProjectLoaded && loadAllProjects();
		}
	}, [mapViewerCtx]);

	function loadAllProjects() {
		const userData = { email: loggedInEmail }
		promisify(props.loadProjects, userData)
			.then((res) => {
				parseData(res);
				initiateMapViewer(res)
			})
			.catch((err) => { console.log(err); alert("Oops! Sorry, can't connect to server now."); })
	}

	function parseData(data) {
		const projects = [];
		data.projects.map((project) => {
			const _project = new Project();
			_project.id = project.id;
			_project.name = project.project_name;
			_project.city = project.city;
			data.assets.map(asset => {
				if (project.id === asset.project_id) {
					const _asset = new Asset();
					_asset.id = asset.tile_url;
					_asset.name = asset.name;
					_asset.type = asset.type;
					_asset.annotations = {};
					_asset.created = asset.ion_created_date;
					_project.assets[asset.tile_url] = _asset;
				}
			});
			projects.push(_project);
		});
		mapStoreCtx.updateProjects(projects);
	}

	function initiateMapViewer(data) {
		data.assets.map((asset, index) => {
			if (asset.layer_type === LAYER_TYPES.PointCloud) {
				const tileset = mapViewerCtx.mapView.viewer.scene.primitives.add(
					new Cesium.Cesium3DTileset({
						url: Cesium.IonResource.fromAssetId(parseInt(asset.tile_url)),
						dynamicScreenSpaceError: true,
						dynamicScreenSpaceErrorDensity: 0.00278,
						dynamicScreenSpaceErrorFactor: 4.0,
						dynamicScreenSpaceErrorHeightFalloff: 0.25
					})
				);
				tileset.style = new Cesium.Cesium3DTileStyle({
					pointSize: 2
				});

				tileset.maximumScreenSpaceError = 8; // it's good for calculating elevation as small as possible but occurs gpu overflow
				tileset.pointCloudShading.geometricErrorScale = 2;
				tileset.pointCloudShading.attenuation = true;
				tileset.pointCloudShading.maximumAttenuation = 32;
				tileset.pointCloudShading.eyeDomeLighting = true;
				tileset.pointCloudShading.eyeDomeLightingStrength = 2;
				tileset.pointCloudShading.eyeDomeLightingRadius = 0;
				tileset.pointCloudShading.baseResolution = 0;

				tileset.readyPromise.then(function (_tileset) {
					var heightOffset = 0;
					var boundingSphere = window[asset_name].boundingSphere;
					var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
					var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
					var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
					var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
					_tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
				}).otherwise(function (error) {
					console.log(asset_name);
					console.log(error);
				});

				mapStoreCtx.updateAsset(tileset, asset.project_id, asset.tile_url);
				mapViewerCtx.update(mapViewerCtx.mapView);
			}
			else if (asset.layer_type === LAYER_TYPES.Model3D) {
				const tileset = mapViewerCtx.mapView.viewer.scene.primitives.add(
					new Cesium.Cesium3DTileset({
						url: Cesium.IonResource.fromAssetId(parseInt(asset.tile_url))
					})
				);

				mapStoreCtx.updateAsset(tileset, asset.project_id, asset.tile_url);
				mapViewerCtx.update(mapViewerCtx.mapView);

				!index && mapViewerCtx.mapView.viewer.flyTo(tileset);
			}
			else if (asset.layer_type === LAYER_TYPES.Orthomosaic) {
				const layer = mapViewerCtx.mapView.viewer.imageryLayers.addImageryProvider(
					new Cesium.IonImageryProvider({ assetId: parseInt(asset.tile_url) })
				);
				mapStoreCtx.updateAsset(layer, asset.project_id, asset.tile_url);
				mapViewerCtx.update(mapViewerCtx.mapView);

				!index && mapViewerCtx.mapView.viewer.flyTo(layer);
			}
			else if (asset.layer_type === LAYER_TYPES.DTM) {
				mapViewerCtx.mapView.viewer.terrainProvider =
					new Cesium.CesiumTerrainProvider({
						url: Cesium.IonResource.fromAssetId(asset.tile_url)
					});
			}

			const tileset = mapStoreCtx.data.projects[asset.project_id].assets[asset.tile_url].entity;
            tileset.show = false;
		});
	}

	return (
		<div className="sidebar">
			<TreeView
				projects={props.projects}
				assets={props.assets}
				annotations={props.annotations}
			/>
			<BottomBar />
		</div>
	);
}

const mapStateToProps = state => ({
	isProjectLoaded: state.project.isProjectLoaded,
	projects: state.project.projects,
	assets: state.project.assets,
	annotations: state.project.annotations
});

Layers.propTypes = {
	isProjectLoaded: PropTypes.bool.isRequired,
	projects: PropTypes.array.isRequired,
	assets: PropTypes.array.isRequired,
	annotations: PropTypes.array.isRequired
}

export default compose(
	withRouter,
	connect(mapStateToProps, projectActionCreators)
)(Layers);