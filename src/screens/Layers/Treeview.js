import React, { useContext, createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
//import TreeView from '@material-ui/lab/TreeView';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { createWorldTerrain } from "cesium/Cesium";

import { Cesium } from '../../global/constant';
import { projectActionCreators } from "../../store/project/actions";
import { LAYER_TYPES } from '../../global/constant';
import { sharedMVContext, mapStoreContext } from '../../global/AppContext';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { enableRipple } from '@syncfusion/ej2-base';
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
enableRipple(true);

const dateItemLabelInformation = {};
function CustomizedTreeView(props) {
    let nodeIndex = 0;
    const { projects, assets, selectedAsset, setSelectedAsset, setSelectedTimelines } = props;
    const { mapView } = useContext(sharedMVContext);
    const mapStoreCtx = useContext(mapStoreContext);
    const [projectName, setProjectName] = useState('4');
    const [projectElements, setProjectElements] = useState([]);
    const [checkedNodes, setCheckedNodes] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [fields, setFields] = useState({});
    const [showModels, setShowModels] = useState({})
    const treeViewRef = createRef();

    useEffect(() => {
        if (projects.length > 0) {
            _hideAllModels(mapStoreCtx.data);
            setProjectElements(_renderElements());
            setExpandedNodes([]);
        }
    }, [projects, projectName]);

    useEffect(() => {
        treeViewRef.current.checkAll(checkedNodes);
        _parentStyleChange();
    }, [checkedNodes]);

    useEffect(() => {
        treeViewRef.current.expandAll(expandedNodes);
    }, [expandedNodes]);

    useEffect(() => {
        if (projectElements.length > 0) {
            setFields({ dataSource: projectElements, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' });
            _initialModelShow();
        }
    }, [projectElements]);

    useEffect(() => {
        if (selectedAsset !== "") {
            const _selectedAsset = moment(selectedAsset, "YYYY-MM-DD").format("YYYYMMDD");
            if (dateItemLabelInformation['source'] !== 'self') {
                _parentNodeChange(dateItemLabelInformation[_selectedAsset], _selectedAsset);
            }
            dateItemLabelInformation['source'] = 'timeline';
        }

    }, [selectedAsset]);

    useEffect(() => {
        _firstModelShow();
    }, [showModels]);

    const _projectNameChange = (event) => {
        setProjectName(event.target.value);
    };

    const _parentNodeChange = (_nodeIds, _selectedAsset) => {
        if (projectElements.length === 0) return;
        const _checkedNodeIds = Object.keys(treeViewRef.current.getAllCheckedNodes());
        const _expandedNodeIds = [];
        const _showModels = Object.assign({}, showModels);
        for (const expandedNode of expandedNodes) {
            _expandedNodeIds.push(expandedNode);
        }
        for (const _nodeId of _nodeIds) {
            _checkedNodeIds.indexOf(_nodeId) > -1 ? _checkedNodeIds : _checkedNodeIds.push(_nodeId);
            let pId = projectElements[_nodeId - 1].pid;
            _expandedNodeIds.indexOf(pId) > -1 ? _expandedNodeIds : _expandedNodeIds.push(pId);
        }
        projects.map(project => {
            if (projectName == project.id) {
                const _assets = _getAssetsOfProject(project.id);
                for (const _asset of _assets) {
                    const _key = moment(_asset.ion_created_date).format("YYYYMMDD");
                    if (_selectedAsset == _key) {
                        _showModels['mId' + `${_asset.tile_url}`] = true;
                    }
                }
                return;
            }
        });
        setCheckedNodes(_checkedNodeIds);
        setExpandedNodes(_expandedNodeIds);
        setShowModels(_showModels);
    }

    const _parentStyleChange = () => {
        let allElements = document.querySelectorAll('.e-level-1');
        for (const aElement of allElements) {
            let isChecked = true;
            const _iconHTMLText = aElement.querySelector('.e-text-content').querySelector(".e-frame").className;
            isChecked = _iconHTMLText.includes("e-check");
            if (isChecked) {
                aElement.querySelector(".e-list-text").classList.add("e-parent-active");
            } else if (_iconHTMLText.includes("e-stop")) {
                aElement.querySelector(".e-list-text").classList.add("e-parent-active");
            } else {
                aElement.querySelector(".e-list-text").classList.remove("e-parent-active");
            }
        }
    }

    const _groupAssetsByType = (_assets) => {
        const groupedAssets = {};
        for (const _asset of _assets) {
            if (groupedAssets[_asset.layer_type]) {
                groupedAssets[_asset.layer_type].push(_asset);
            } else {
                groupedAssets[_asset.layer_type] = [_asset];
            }
        }
        return groupedAssets;
    }

    const _hideAllModels = (data) => {
        for (const _projectKey in data.projects) {
            for (const _assetKey in data.projects[_projectKey].assets) {
                if (data.projects[_projectKey].assets[_assetKey].entity) {
                    data.projects[_projectKey].assets[_assetKey].entity.show = false;
                }
            }
        }
    }

    const _checkShowOrHide = (_evt, _asset = null) => {
        let isChecked = true;
        isChecked = _evt.target.className.includes("e-check");
        if (_asset && _asset.layer_type === LAYER_TYPES.DTM) {
            if (isChecked) {
                mapView.viewer.terrainProvider =
                    new Cesium.CesiumTerrainProvider({
                        url: Cesium.IonResource.fromAssetId(_asset.tile_url)
                    });
            } else {
                mapView.viewer.terrainProvider =
                    createWorldTerrain({
                        requestWaterMask: true,
                        requestVertexNormals: true
                    })
            }
        }

        return isChecked;
    }

    const _navigateModel = (isChecked, _assets) => {
        const _timeLabels = [];
        for (const _asset of _assets) {
            if (_asset.layer_type === LAYER_TYPES.Orthomosaic) {
                const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
                tileset.show = true;
                mapView.viewer.flyTo(tileset);
            } else if (_asset.layer_type === LAYER_TYPES.DTM) {
                mapView.viewer.terrainProvider =
                    new Cesium.CesiumTerrainProvider({
                        url: Cesium.IonResource.fromAssetId(_asset.tile_url)
                    });
            } else if (
                _asset.layer_type === LAYER_TYPES.PointCloud ||
                _asset.layer_type === LAYER_TYPES.Model3D
            ) {
                const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
                tileset.show = true;
                mapView.viewer.flyTo(tileset);
            } else if (_asset.layer_type === LAYER_TYPES.DSM) {

            }

            const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
            tileset.show = isChecked;
        }

        for (const _asset of _assets) {
            let tempTimes = moment(_asset.ion_created_date).format("YYYY-MM-DD")
            _timeLabels.includes(tempTimes) > 0 ? _timeLabels : _timeLabels.push(tempTimes);
        }
        setSelectedTimelines(_timeLabels);
    }

    const _showHideModel = (_evt, _assets) => {
        const _showModels = Object.assign({}, showModels);
        for (const _asset of _assets) {
            const _willShow = _checkShowOrHide(_evt, _asset);
            _willShow ? _showModels['mId' + `${_asset.tile_url}`] = true : _showModels['mId' + `${_asset.tile_url}`] = false;
        }
        const _timeLabels = [];
        const isChecked = _checkShowOrHide(_evt);
        if (isChecked) {
            for (const _asset of _assets) {
                let tempTimes = moment(_asset.ion_created_date).format("YYYY-MM-DD")
                _timeLabels.includes(tempTimes) > 0 ? _timeLabels : _timeLabels.push(tempTimes);
            }
            setSelectedTimelines(_timeLabels);
        }
        setShowModels(_showModels);
    }

    const _renderAssets = (_assets, _name) => {
        const uiAssets = [];
        const groupedAssets = _groupAssetsByType(_assets);
        for (const _key in groupedAssets) {
            if (groupedAssets[_key].length === 0) continue;
            uiAssets.push(
                { id: `${nodeIndex + 1}`, name: _key, hasChild: true, proData: groupedAssets[_key] },
            );
            const _parentId = nodeIndex + 1;
            nodeIndex++;
            const _childs = [];
            for (const _asset of groupedAssets[_key]) {
                const _creatDate = moment(_asset.ion_created_date).format("YYYYMMDD");
                const label_name = _creatDate + "_" + _name.toUpperCase() + "_" + _asset.layer_type.toLowerCase();
                _childs.push(
                    { id: `${nodeIndex + 1}`, pid: `${_parentId}`, name: label_name, proData: _asset },
                );

                if (!dateItemLabelInformation[_creatDate] || dateItemLabelInformation[_creatDate].includes(`${nodeIndex + 1}`) > 0) {
                    dateItemLabelInformation[_creatDate] = [];
                }
                dateItemLabelInformation[_creatDate].push(`${nodeIndex + 1}`);

                nodeIndex++;
            }

            for (const _child of _childs) {
                uiAssets.push(_child);
            }
        }
        return uiAssets;
    }

    const _onDateIconClick = (_evt, _asset) => {
        const _willShow = _checkShowOrHide(_evt);
        if (_willShow) {
            const _timeLabels = [];
            const _creatDate = moment(_asset.ion_created_date).format("YYYY-MM-DD");
            _timeLabels.push(_creatDate);
            setSelectedTimelines(_timeLabels);
            dateItemLabelInformation['source'] = 'self';
        }
        _setShowModel(_asset.tile_url, _willShow);
    }

    const _firstModelShow = () => {
        let index = 0;
        for (const key in showModels) {
            const tileset = mapStoreCtx.data.projects[projectName].assets[key.slice(3)].entity;
            if (showModels[key] && index === 0) {
                tileset.show = true;
                mapView.viewer.flyTo(tileset);
                index++;
            } else {
                tileset.show = false;
            }
        }
    }

    const _initialModelShow = () => {
        const _showModels = {};
        for (const projectElement of projectElements) {
            if (!projectElement.hasChild) _showModels['mId' + `${projectElement.proData.tile_url}`] = false;
        }
        setShowModels(_showModels);
    }

    const _setShowModel = (_assetTileUrl, isChecked) => {
        const _showModels = Object.assign({}, showModels);
        isChecked ? _showModels['mId' + `${_assetTileUrl}`] = true : _showModels['mId' + `${_assetTileUrl}`] = false;
        setShowModels(_showModels);
    }

    const _onDateLabelClick = (isChecked, _asset) => {
        const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
        tileset.show = isChecked;
        mapView.viewer.flyTo(tileset);
    }

    const _renderProject = (_project) => {
        const _assets = _getAssetsOfProject(_project.id);
        const _renAssets = _renderAssets(_assets, _project.project_name);
        const uiDirectories = [];
        for (const _asset of _renAssets) {
            uiDirectories.push(_asset);
        }
        return uiDirectories
    }

    const _projectLabelClicked = (_project) => {
        const _assets = _getAssetsOfProject(_project.id);
        const _timeLabels = [];
        for (const _asset of _assets) {
            let tempTimes = moment(_asset.ion_created_date).format("YYYY-MM-DD")
            _timeLabels.includes(tempTimes) > 0 ? _timeLabels : _timeLabels.push(tempTimes);
        }
        setSelectedTimelines(_timeLabels);
    }

    const _renderElements = () => {
        const uiElements = [];
        for (const _project of projects) {
            if (projectName == _project.id) {
                const _projectItemView = _renderProject(_project);
                for (const _projectItem of _projectItemView) {
                    uiElements.push(_projectItem);
                }
                _projectLabelClicked(_project);
            }
        }
        return uiElements;
    }

    const _getAssetsOfProject = (_projectID) => {
        const _assets = [];
        props.assets.map(_asset => {
            if (_projectID === _asset.project_id) {
                _assets.push(_asset);
            }
        });
        return _assets;
    }

    const _nodeExpand = (_evt, _nodeId) => {
        const _expandedNodeIds = [];
        for (const expandedNode of expandedNodes) {
            _expandedNodeIds.push(expandedNode);
        }
        let index = _expandedNodeIds.indexOf(_nodeId);
        index > -1 ? _expandedNodeIds.splice(index, 1) : _expandedNodeIds.push(_nodeId);
        setExpandedNodes(_expandedNodeIds);
    }

    const _nodeCheck = (_evt, _nodeId, _nodeLevel) => {
        const _assets = projectElements[_nodeId - 1].proData;
        _nodeLevel === "1" ? _showHideModel(_evt, _assets) : '';
        _nodeLevel === "2" ? _onDateIconClick(_evt, _assets) : '';
        _parentStyleChange();
    }

    const _nodeClick = (_evt) => {
        const _nodeLevel = _evt.target.closest("li").getAttribute('aria-level');
        const _nodeId = _evt.target.closest("li").getAttribute('data-uid');
        if (_evt.target.className.includes("e-fullrow")) {
            let isNodeChecked = true;
            isNodeChecked = Boolean(_evt.target.nextSibling.querySelector(".e-check"));
            if (_nodeLevel === "1") {
                const _assets = projectElements[_nodeId - 1].proData;
                _assets.length > 0 ? _navigateModel(isNodeChecked, _assets) : '';
            } else if (_nodeLevel === "2") {
                const _asset = projectElements[_nodeId - 1].proData;
                _onDateLabelClick(isNodeChecked, _asset);
            }
        } else if (_evt.target.className.includes("e-frame")) {
            _nodeCheck(_evt, _nodeId, _nodeLevel);
        } else if (_evt.target.className.includes("interaction")) {
            _nodeExpand(_evt, _nodeId);
        }
    }

    return (
        <div>
            <FormControl variant="outlined" className="select-project" style={{ padding: '20px', width: '90%' }}>
                {
                    projects.length > 0 &&
                    <Select
                        value={projectName}
                        onChange={_projectNameChange}
                        style={{ color: '#02233f' }}
                    >
                        {projects.map((project, i) => (
                            project.status === "active" ?
                                <MenuItem value={project.id} key={i}>{project.project_name}</MenuItem>
                                : ''
                        ))}
                    </Select>
                }
            </FormControl>
            <TreeViewComponent
                fields={fields}
                ref={treeViewRef}
                showCheckBox={true}
                cssClass={'check-treeview'}
                allowMultiSelection={true}
                onClick={(_evt) => _nodeClick(_evt)}
            />
        </div>

    );
}

const mapStateToProps = state => ({
    projects: state.project.projects,
    assets: state.project.assets,
    annotations: state.project.annotations,
    selectedAsset: state.project.selectedAsset,
    setSelectedAsset: state.project.setSelectedAsset,
    setSelectedTimelines: state.project.setSelectedTimelines
});

CustomizedTreeView.propTypes = {
    projects: PropTypes.array.isRequired,
    assets: PropTypes.array.isRequired,
    annotations: PropTypes.array.isRequired,
    selectedAsset: PropTypes.string.isRequired,
    setSelectedAsset: PropTypes.func.isRequired,
    setSelectedTimelines: PropTypes.func.isRequired
}

export default compose(
    withRouter,
    connect(mapStateToProps, projectActionCreators)
)(CustomizedTreeView);