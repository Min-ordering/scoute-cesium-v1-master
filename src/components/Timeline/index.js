import React, { useState, useEffect } from 'react';
import { projectActionCreators } from "../../store/project/actions";
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';

import './style.css';

const selectedStyle = {
    background: '#07233f',
    border: '1px solid azure'
}
const noneStyle = {};

function Timeline(props) {
    const { projects, assets, selectedAsset, setSelectedAsset, selectedTimelines, setSelectedTimelines } = props;

    const [selected, setSelected] = useState([0]);
    const [timeLabels, setTimeLabels] = useState(Array(5).fill(""));

    const _handleSelected = (index) => {
        const _clone = Array(4).fill(false);
        _clone[index] = true;
        setSelected(_clone);
        setSelectedAsset(timeLabels[index] || "");
    }

    useEffect(() => {
        const labels = [];
        assets.map(asset => {
            const _label = moment(asset.ion_created_date.split(" ")[0]).format('YYYY-MM-DD');
            if (labels.indexOf(_label) < 0) {
                labels.push(_label);
            }
        });

        setSelectedTimelines(labels);
    }, [assets]);

    useEffect(() => {
        const labels = [...selectedTimelines];
        labels.sort(function (a, b) {
            a = moment(a, "YYYY-MM-DD").format('YYYYMMDD');
            b = moment(b, "YYYY-MM-DD").format('YYYYMMDD');
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });

        setTimeLabels(labels);
    }, [selectedTimelines]);

    useEffect(() => {
        if (timeLabels.length > 0) {
            const _clone = Array(4).fill(false);
            _clone[0] = true;
            setSelected(_clone);
        }
    }, [timeLabels])

    return (
        <div className="timeline-container">
            <div className="timeline-flex-container">
                <div className="timeline-slider">
                    <div className="timeline-circle-container">
                        <div className="timeline-circle" onClick={() => _handleSelected(0)} style={selected[0] ? selectedStyle : noneStyle} />
                        <p className="timeline-title" onClick={() => _handleSelected(0)}>{timeLabels[0]}</p>
                    </div>
                    <div className="timeline-circle-container">
                        <div className="timeline-circle" onClick={() => _handleSelected(1)} style={selected[1] ? selectedStyle : noneStyle} />
                        <p className="timeline-title" onClick={() => _handleSelected(1)}>{timeLabels[1]}</p>
                    </div>
                    <div className="timeline-circle-container">
                        <div className="timeline-circle" onClick={() => _handleSelected(2)} style={selected[2] ? selectedStyle : noneStyle} />
                        <p className="timeline-title" onClick={() => _handleSelected(2)}>{timeLabels[2]}</p>
                    </div>
                    <div className="timeline-circle-container">
                        <div className="timeline-circle" onClick={() => _handleSelected(3)} style={selected[3] ? selectedStyle : noneStyle} />
                        <p className="timeline-title" onClick={() => _handleSelected(3)}>{timeLabels[3]}</p>
                    </div>
                    <div className="timeline-circle-container">
                        <div className="timeline-circle" onClick={() => _handleSelected(4)} style={selected[4] ? selectedStyle : noneStyle} />
                        <p className="timeline-title" onClick={() => _handleSelected(4)}>{timeLabels[4]}</p>
                    </div>
                </div>
                <div className="timeline-cross-bar" />
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    projects: state.project.projects,
    assets: state.project.assets,
    annotations: state.project.annotations,
    selectedAsset: state.project.selectedAsset,
    setSelectedAsset: state.project.setSelectedAsset,
    selectedTimelines: state.project.selectedTimelines,
    setSelectedTimelines: state.project.setSelectedTimelines
});

Timeline.propTypes = {
    projects: PropTypes.array.isRequired,
    assets: PropTypes.array.isRequired,
    annotations: PropTypes.array.isRequired,
    selectedAsset: PropTypes.string.isRequired,
    setSelectedAsset: PropTypes.func.isRequired,
    selectedTimelines: PropTypes.array.isRequired,
    setSelectedTimelines: PropTypes.func.isRequired
}

export default compose(
    withRouter,
    connect(mapStateToProps, projectActionCreators)
)(Timeline);