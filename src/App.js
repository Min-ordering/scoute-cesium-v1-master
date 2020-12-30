import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import configureStore, { history } from './store/configure';

import MapView from "./global/MapView";
import { sharedMVContext, mapStoreContext } from "./global/AppContext";
import SignInPage from "./screens/SignIn";
import SignUpPage from "./screens/SignUp";
import Annotate from './screens/Annotate';
import Layers from './screens/Layers';
import Export from './screens/Export';
import Measure from './screens/Measure';
import Header from "./components/Header";
import UploadPage from "./screens/Upload";
import ZoomBar from "./components/ZoomBar";
import DimensionToggler from "./components/DimensionToggler";
import StatusBar from "./components/StatusBar";
import Timeline from "./components/Timeline";
import MapStore, { Annotation } from "./global/MapStore";
import ErrorBoundary from './components/ErrorBoundary';

import './global/index.css';

export const store = configureStore();

function App() {
  const [globalMapViewer, setGlobalMapViewer] = useState({});
  const [mapStore, setMapStore] = useState(new MapStore());

  useEffect(() => {
    setGlobalMapViewer(new MapView());
  }, []);

  const updateProjects = (projects) => {
    projects.map(project => {
      mapStore.projects[project.id] = project;
    });
    setMapStore(mapStore);
  }

  const updateAsset = (asset, project_id, asset_id) => {
    mapStore.projects[project_id].assets[asset_id].entity = asset;
    setMapStore(mapStore);
  }

  const updateAnnotations = (annotation_id, annotation, type, color) => {
    if (!mapStore.annotations[annotation_id]) {
      mapStore.annotations[annotation_id] = new Annotation;
    }
    mapStore.annotations[annotation_id].id = annotation_id;
    mapStore.annotations[annotation_id].name = annotation_id;
    mapStore.annotations[annotation_id].type = type;
    mapStore.annotations[annotation_id].color = color;
    mapStore.annotations[annotation_id].entity = annotation;

    setMapStore(mapStore);
  }

  const updateComments = (annotation_id, comment) => {
    mapStore.annotations[annotation_id].conversations.push(comment);
    setMapStore(mapStore);
  }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <sharedMVContext.Provider value={{
          mapView: globalMapViewer,
          update: (_updated) => setGlobalMapViewer(_updated)
        }}>
          <mapStoreContext.Provider value={{
            data: mapStore,
            updateProjects: (projects) => updateProjects(projects),
            updateAsset: (asset, project_id, asset_id) => updateAsset(asset, project_id, asset_id),
            updateAnnotations: (annotation_id, annotation, type, color) => updateAnnotations(annotation_id, annotation, type, color),
            updateComments: (annotation_id, comment) => updateComments(annotation_id, comment)
          }}>
            <div className="route-wrapper">
              <Router>
                <Header />
                <ZoomBar />
                <DimensionToggler />
                <Timeline />
                <StatusBar />
                <div style={{ display: "flex", width: '100%' }}>
                  <Switch>
                    <Route exact path='/' render={() => <SignInPage />} />
                    <Route exact path='/register' render={() => <SignUpPage />} />
                    <Route exact path='/layers' render={() => <ErrorBoundary children={<Layers />} />} />
                    <Route exact path='/annotate' render={() => <ErrorBoundary children={<Annotate />} />} />
                    <Route exact path='/export' render={() => <ErrorBoundary children={<Export />} />} />
                    <Route exact path='/measure' render={() => <ErrorBoundary children={<Measure />} />} />
                    <Route exact path='/upload' render={() => <ErrorBoundary children={<UploadPage />} />} />
                    <Redirect to='/' />
                  </Switch>
                  <div id="cesiumContainer" />
                  <div id="projection-picker" />
                </div>
              </Router>
            </div>
          </mapStoreContext.Provider>
        </sharedMVContext.Provider>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
