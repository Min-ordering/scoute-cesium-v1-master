import React from 'react';
import { projectActionCreators } from "../../store/project/actions";
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import './style.css';

function BottomBar(props) {
  const { history, selectedBottomButtonIndex, setSelectedBottomButtonIndex, setSelectedHeaderButtonIndex } = props;
  function _redirect(link) {
    history.push(link);
  }

  return (
    <div className="bottom-tab-tool-bar">
      <div className="bottom-tab-icon" onClick={() => {
        _redirect("layers");
        setSelectedBottomButtonIndex(1);
        setSelectedHeaderButtonIndex(0);
      }}
        style={1 === selectedBottomButtonIndex ? { backgroundColor: '#315f88' } : {}} >
        <svg width="36" height="36" viewBox="0 0 24 24">
          <path fill="#fff" d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
      </div>
      {/* <div className="bottom-tab-icon" onClick={() => {
        _redirect("upload");
        setSelectedBottomButtonIndex(2);
        setSelectedHeaderButtonIndex(0);
      }}
        style={2 === selectedBottomButtonIndex ? { backgroundColor: '#315f88' } : {}} >
        <svg width="36" height="36" viewBox="0 0 24 24">
          <path fill="#fff" d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
        </svg>
      </div> */}
      <div className="bottom-tab-icon" onClick={() => {
        _redirect("setting");
        setSelectedBottomButtonIndex(3);
        setSelectedHeaderButtonIndex(0);
      }}
        style={3 === selectedBottomButtonIndex ? { backgroundColor: '#315f88' } : {}} >
        <svg width="36" height="36" viewBox="0 0 24 24">
          <path fill="#fff" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
      </div>
      <div className="bottom-tab-icon" onClick={() => {
        _redirect("help");
        setSelectedBottomButtonIndex(4);
        setSelectedHeaderButtonIndex(0);
      }}
        style={4 === selectedBottomButtonIndex ? { backgroundColor: '#315f88' } : {}} >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
          <path fill="#fff" d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
        </svg>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  selectedBottomButtonIndex: state.project.selectedBottomButtonIndex,
  setSelectedBottomButtonIndex: state.project.setSelectedBottomButtonIndex,
  setSelectedHeaderButtonIndex: state.project.setSelectedHeaderButtonIndex
});

BottomBar.propTypes = {
  selectedBottomButtonIndex: PropTypes.number.isRequired,
  setSelectedBottomButtonIndex: PropTypes.func.isRequired,
  setSelectedHeaderButtonIndex: PropTypes.func.isRequired
}

export default compose(
  withRouter,
  connect(mapStateToProps, projectActionCreators)
)(BottomBar);