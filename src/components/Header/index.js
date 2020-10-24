import React, { useState } from 'react';
import { projectActionCreators } from "../../store/project/actions";
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './style.css';

function Header(props) {
  const { history, selectedHeaderButtonIndex, setSelectedBottomButtonIndex, setSelectedHeaderButtonIndex } = props;
  const email = localStorage.getItem("zedex2020/email", "user@zedex.com");
  const [logoutHidden, setLogoutHidden] = useState(true);

  const _redirect = (link) => {
    history.push(link);
  }

  const _logout = () => {
    setLogoutHidden(true);
    localStorage.removeItem("zedex2020/email");
    history.push("/");
  }

  return (
    <div className="header" id="appHeader">
      <div className="tab-bar">
        <div className="tab-icon" onClick={() => {
          _redirect("layers");
          setSelectedHeaderButtonIndex(1);
          setSelectedBottomButtonIndex(0);
        }}
          style={selectedHeaderButtonIndex === 1 ? { backgroundColor: '#315f88' } : {}} >
          <svg className="svg-tab-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#fff" d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" /></svg>
          <div style={{ paddingTop: 28 }}>Layers</div>
        </div>
        <div className="tab-icon" onClick={() => {
          _redirect("annotate");
          setSelectedHeaderButtonIndex(2);
          setSelectedBottomButtonIndex(0);
        }}
          style={selectedHeaderButtonIndex === 2 ? { backgroundColor: '#315f88' } : {}} >
          <svg className="svg-tab-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
          <div style={{ paddingTop: 28 }}>annotate</div>
        </div>
        <div className="tab-icon" onClick={() => {
          _redirect("measure");
          setSelectedHeaderButtonIndex(3);
          setSelectedBottomButtonIndex(0);
        }}
          style={selectedHeaderButtonIndex === 3 ? { backgroundColor: '#315f88' } : {}} >
          <svg className="svg-tab-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 -5 28 28"><path fill="#fff" d="M0 17v-17h6v2h-2v1h2v2h-2v1h2v2h-2v1h2v2h-2v1h2v2h-2v1h2v2h-6zm22 1v2h-1v-2h-2v2h-1v-2h-2v2h-1v-2h-2v2h-1v-2h-2v2h-1v-2h-2v6h17v-6h-2zm-22 6h6v-6h-6v6z" /></svg>
          <div style={{ paddingTop: 28 }}>measure</div>
        </div>
        <div className="tab-icon" onClick={() => {
          _redirect("export");
          setSelectedHeaderButtonIndex(4);
          setSelectedBottomButtonIndex(0);
        }}
          style={selectedHeaderButtonIndex === 4 ? { backgroundColor: '#315f88' } : {}} >
          <svg className="svg-tab-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#fff" d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" /></svg>
          <div style={{ paddingTop: 28 }}>export</div>
        </div>
      </div>
      <div className="logout-button">
        <div style={{ display: 'flex' }} onClick={() => setLogoutHidden(!logoutHidden)}>
          <svg className="svg-user-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" /></svg>
          <p className="svg-user-name">{email}</p>
          <svg className="svg-user-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M7,10L12,15L17,10H7Z" /></svg>
        </div>
        <div className="logout-menu" style={{ display: logoutHidden ? 'none' : 'flex' }} onClick={_logout}>
          <svg className="svg-logout-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#07233f" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" /></svg>
          <p className="logout-text">SIGN OUT</p>
        </div>
      </div>
      <div className="app-name">
        <h1>ZEDEX</h1>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  selectedHeaderButtonIndex: state.project.selectedHeaderButtonIndex,
  setSelectedHeaderButtonIndex: state.project.setSelectedHeaderButtonIndex,
  setSelectedBottomButtonIndex: state.project.setSelectedBottomButtonIndex
});

Header.propTypes = {
  selectedHeaderButtonIndex: PropTypes.number.isRequired,
  setSelectedHeaderButtonIndex: PropTypes.func.isRequired,
  setSelectedBottomButtonIndex: PropTypes.func.isRequired
}

export default compose(
  withRouter,
  connect(mapStateToProps, projectActionCreators)
)(Header);