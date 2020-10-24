import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { createWorldTerrain } from "cesium/Cesium";

import { Cesium } from '../../global/constant';
import { projectActionCreators } from "../../store/project/actions";
import { LAYER_TYPES } from '../../global/constant';
import { sharedMVContext, mapStoreContext } from '../../global/AppContext';

import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const dateItemLabelInformation = {};
function CustomizedTreeView(props) {
    let nodeIndex = 0;

    const classes = useStyles();
    const { projects, assets, selectedAsset, setSelectedAsset, setSelectedTimelines } = props;
    const { mapView } = useContext(sharedMVContext);
    const mapStoreCtx = useContext(mapStoreContext);
    const [selectedItem, setSelectedItem] = useState(['1']);
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [childElements, setChildElements] = useState([]);
    const [parentNodeIds, setParentNodeIds] = useState({});
    const [projectName, setProjectName] = useState('4');
    const [childNodeIds, setChildNodeIds] = useState([]);

    useEffect(() => {

        if (projects.length > 0) {
            _hideAllModels(mapStoreCtx.data);
            setChildElements(_renderElements());
            setExpandedNodes([]);
        }

    }, [projects, projectName]);

    useEffect(() => {

        if (selectedAsset !== "") {

            const _selectedAsset = moment(selectedAsset, "YYYY-MM-DD").format("YYYYMMDD");
            if (dateItemLabelInformation['source'] !== 'self') {
                setSelectedItem(dateItemLabelInformation[_selectedAsset]);
                _parentNodeChange(dateItemLabelInformation[_selectedAsset], _selectedAsset);

            } else {
                _parentStyleChange();
            }

            dateItemLabelInformation['source'] = 'timeline';

        }

    }, [selectedAsset]);

    useEffect(() => {
        _parentStyleChange();
    }, [expandedNodes])

    const _projectNameChange = (event) => {
        setProjectName(event.target.value);
    };

    const _parentNodeChange = (_nodeIds, _selectedAsset) => {

        const _tempExpandedNodes = [];
        for (const expandedNode of expandedNodes) {
            _tempExpandedNodes.push(expandedNode)
        }
        for (const _nodeId of _nodeIds) {
            _tempExpandedNodes.includes(_nodeId) > 0 ? _tempExpandedNodes : _tempExpandedNodes.push(_nodeId);
        }

        projects.map(project => {
            if (projectName == project.id) {
                const _assets = _getAssetsOfProject(project.id);
                for (const _asset of _assets) {
                    const _key = moment(_asset.ion_created_date).format("YYYYMMDD");
                    if (_selectedAsset == _key) {
                        let index = "";
                        index = parentNodeIds[_asset.layer_type];
                        _tempExpandedNodes.includes(index) > 0 ? _tempExpandedNodes : _tempExpandedNodes.push(index);
                        const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
                        tileset.show = true;
                        mapView.viewer.flyTo(tileset);
                    }
                }
                return;
            }

        });
        setExpandedNodes(_tempExpandedNodes);
    }

    const _parentStyleChange = () => {
        let allElements = document.querySelectorAll('.gis-type');
        for (const aElement of allElements) {
            if (aElement.querySelector('.Mui-expanded')) {
                aElement.querySelector('.MuiTreeItem-label').classList.add("chkParent-node");
            } else {
                aElement.querySelector('.MuiTreeItem-label').classList.remove("chkParent-node");
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

    const _checkShowOrHide = (evt, _asset = null) => {
        let isChecked = true;
        isChecked = !evt.target.closest("li").classList.contains("Mui-expanded");

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

    const _navigateModel = (evt, _assets) => {
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
        }

        _showHideModel(evt, _assets);
    }

    const _showHideModel = (evt, _assets) => {
        for (const _asset of _assets) {
            const _willShow = _checkShowOrHide(evt, _asset);
            const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
            tileset.show = _willShow;
        }
    }

    const _renderAssets = (_assets, _name) => {
        const uiAssets = [];
        const groupedAssets = _groupAssetsByType(_assets);
        const tempParentIds = {};
        const tempChildNodeIds = {};
        for (const _key in groupedAssets) {
            const _childNodeIds = []
            if (groupedAssets[_key].length === 0) continue;

            const _childs = [];
            for (const _asset of groupedAssets[_key]) {
                const _creatDate = moment(_asset.ion_created_date).format("YYYYMMDD");
                const label_name = _creatDate + "_" + _name.toUpperCase() + "_" + _asset.layer_type.toLowerCase();
                _childs.push(
                    <StyledTreeItem
                        nodeId={`${nodeIndex + 1}`}
                        label={label_name}
                        key={`${nodeIndex + 1}`}
                        expanded={expandedNodes}
                        onIconClick={(evt) => _onDateIconClick(evt, _asset)}
                        onLabelClick={(evt) => _onDateLabelClick(evt, _key, _asset)}
                        className="date-label"
                        id={`${nodeIndex + 1}`}
                    >
                        <StyledTreeItem nodeId={`${nodeIndex + 2}`} label="Annotations" />
                        <StyledTreeItem nodeId={`${nodeIndex + 3}`} label="Measurements" />
                    </StyledTreeItem>
                );
                if (!dateItemLabelInformation[_creatDate] || dateItemLabelInformation[_creatDate].includes(`${nodeIndex + 1}`) > 0) {
                    dateItemLabelInformation[_creatDate] = [];
                }
                dateItemLabelInformation[_creatDate].push(`${nodeIndex + 1}`);
                _childNodeIds.push(`${nodeIndex + 1}`);
                nodeIndex += 3;
            }

            uiAssets.push(
                <StyledTreeItem
                    nodeId={`${nodeIndex + 1}`}
                    label={_key}
                    key={nodeIndex + 1}
                    onIconClick={(evt) => _showHideModel(evt, groupedAssets[_key])}
                    onLabelClick={(evt) => _navigateModel(evt, groupedAssets[_key])}
                    className="gis-type"
                    id={`${nodeIndex + 1}`}
                >
                    {_childs}
                </StyledTreeItem>
            );
            tempParentIds[_key] = `${nodeIndex + 1}`;
            tempChildNodeIds[`${nodeIndex + 1}`] = _childNodeIds;
            nodeIndex++;
        }
        setChildNodeIds(tempChildNodeIds);
        setParentNodeIds(tempParentIds);
        return uiAssets;
    }

    const _onDateIconClick = (_evt, _asset) => {
        const _willShow = _checkShowOrHide(_evt);
        const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
        tileset.show = _willShow;
    }

    const _onDateLabelClick = (_evt, _key, _asset) => {
        const _timeLabels = [];
        let isCheckParent = true;
        const _creatDate = moment(_asset.ion_created_date).format("YYYYMMDD");
        _timeLabels.push(moment(_asset.ion_created_date).format("YYYY-MM-DD"));
        setSelectedTimelines(_timeLabels);
        setSelectedItem(dateItemLabelInformation[_creatDate]);
        setSelectedAsset(_creatDate);
        dateItemLabelInformation['source'] = 'self';
        const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
        tileset.show = true;
        mapView.viewer.flyTo(tileset);
        isCheckParent = Boolean(_evt.target.closest(".gis-type").querySelector('.Mui-expanded'));
        _onDateIconClick(_evt, _asset);

    }


    const _renderProject = (_project) => {
        const _assets = _getAssetsOfProject(_project.id);
        const uiDirectories = [];
        uiDirectories.push(_renderAssets(_assets, _project.project_name));
        return uiDirectories
    }

    const _projectIconClicked = (_assets) => {

        const _willShow = true;
        for (const _asset of _assets) {
            const tileset = mapStoreCtx.data.projects[_asset.project_id].assets[_asset.tile_url].entity;
            tileset.show = _willShow;
        }

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
                uiElements.push(_projectItemView);
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

    const _getAnnotationsOfAsset = (_projectID, _assetID) => {
        const _annotations = [];
        props.annotations.map(_annotation => {
            if (_assetID === _annotation.asset_id && _projectID === _annotation.project_id) {
                _annotations.push(_annotation);
            }
        });

        return _annotation;
    }

    const onNodeToggle = (evt, _nodeIds) => {
        let isParentCheck = true;
        let isChildCheck = true;
        let isCheck = true;
        let isChilds = true;
        let _currentNodeId = evt.target.closest("li").id;
        let _parentNodeId = evt.target.closest(".gis-type").id;
        let allChilds = evt.target.closest(".gis-type").querySelectorAll('.Mui-expanded');
        isChilds = Boolean(evt.target.closest(".gis-type").classList.contains("Mui-expanded"));
        isParentCheck = Boolean(evt.target.closest("li").classList.contains("gis-type"));
        isChildCheck = Boolean(evt.target.closest("li").classList.contains("date-label"));
        isCheck = Boolean(evt.target.closest("li").classList.contains("Mui-expanded"));
        if (!isCheck) {
            if (isParentCheck) {
                for (const _childNodeId of childNodeIds[_currentNodeId]) {
                    _nodeIds.push(_childNodeId);
                }
            }
        } else {
            if (isParentCheck) {
                for (const _childNodeId of childNodeIds[_currentNodeId]) {
                    let _index1 = _nodeIds.indexOf(_childNodeId);
                    _nodeIds.splice(_index1, 1);
                }
            } else if (isChildCheck) {
                if (allChilds.length == 1) {
                    let _index2 = _nodeIds.indexOf(_parentNodeId);
                    _nodeIds.splice(_index2, 1)
                }
            }
        }
        setExpandedNodes(_nodeIds);
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
            <TreeView
                className={classes.root}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                disableSelection={false}
                selected={selectedItem}
                onNodeToggle={(evt, values) => onNodeToggle(evt, values)}
                onNodeSelect={(_, value) => setSelectedItem([`${value}`])}
                expanded={expandedNodes}
                className="project-tree"
            >
                {childElements}
            </TreeView>
        </div>

    );
}

function MinusSquare(props) {
    return (
        <Checkbox
            style={{ width: 8, height: 8, color: '#02233f' }}
            defaultChecked
            inputProps={{ 'aria-label': 'checkbox with default color' }}
        />
    );
}

function PlusSquare(props) {
    return (
        <Checkbox
            style={{ width: 8, height: 8 }}
            color="default"
            inputProps={{ 'aria-label': 'checkbox with default color' }}
        />
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        </SvgIcon>
    );
}

function TransitionComponent(props) {
    const style = useSpring({
        from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

TransitionComponent.propTypes = {
    /**
     * Show the component; triggers the enter or exit states
     */
    in: PropTypes.bool,
};

const StyledTreeItem = withStyles((theme) => ({
    root: {
        marginTop: 10
    },
    iconContainer: {
        '& .close': {
            opacity: 0.3,
        }
    },
    group: {
        marginLeft: 7,
        borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
    label: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '-webkit-line-clamp': 1,
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        lineBreak: 'anywhere'
    }
}))((props) => (
    <div style={{ display: 'flex' }}>
        <div className="horizontal-dotted-box" />
        <TreeItem {...props} TransitionComponent={TransitionComponent} />
    </div>
));

const useStyles = makeStyles({
    root: {
        height: 264,
        flexGrow: 1,
        maxWidth: 400,
    }
});

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