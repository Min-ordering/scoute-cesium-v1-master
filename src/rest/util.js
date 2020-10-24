import { Cesium } from '../global/constant';

export function loadModels(viewer) {
    const tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: Cesium.IonResource.fromAssetId(37886),
        })
    );

    viewer.flyTo(tileset);
}

export function formatDateString(dateString) {
    const date = new Date(dateString);
    return date.toUTCString().substr(5, 11);
}

export function setToolbarsVisibility(visibility, notEntire) {
    document.getElementById('cesiumContainer').hidden = !visibility || notEntire;
    document.getElementById('appHeader').hidden = !visibility;
    document.getElementsByClassName('status-bar')[0].style.display = visibility ? 'block' : 'none';
    document.getElementsByClassName('timeline-container')[0].style.display = visibility ? 'block' : 'none';
    document.getElementsByClassName('zoom-bar')[0].style.display = visibility ? 'block' : 'none';
    document.getElementsByClassName('dimension-toggler')[0].style.display = visibility ? 'flex' : 'none';
}

export function defined(value) {
    return value !== undefined && value !== null;
}

export function getWorldPosition(scene, mousePosition, primitives, result) {
    let position;
    const cartesianScratch = new Cesium.Cartesian3();
    const rayScratch = new Cesium.Ray();
    const ray = scene.camera.getPickRay(mousePosition, rayScratch);
    if (scene.pickPositionSupported) {
        //doesn't ignore billboards with hide and restore, falls through or jumps on models - drill pick instead
        const pickedObjects = scene.drillPick(mousePosition, 2, 1, 1);

        for (let i = 0; i < pickedObjects.length; i++) {
            const pickedObject = pickedObjects[i];
            // check to let us know if we should pick against the globe instead
            if (defined(pickedObject) && (pickedObject instanceof Cesium.Cesium3DTileFeature ||
                pickedObject.primitive instanceof Cesium.Cesium3DTileset || pickedObject.primitive instanceof Cesium.Model)) {
                const pickResult = scene.pickFromRay(ray, primitives._entities.array);
                if (defined(pickResult)) {
                    return Cesium.Cartesian3.clone(pickResult.position, result);
                }
            }
        }
    }

    if (!defined(scene.globe)) {
        return;
    }

    position = scene.globe.pick(ray, scene, cartesianScratch);

    if (defined(position)) {
        return Cesium.Cartesian3.clone(position, result);
    }
}

export function getGlobePositionWithTerrain(viewer, windowPosition) {
    const position = getWorldPosition(viewer.scene, windowPosition, viewer.entities);

    if (!position) return position;
    const cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);

    return cartographicPosition;
}

export function getCameraFocus(viewer) {
    const rayScratch = new Cesium.Ray();
    rayScratch.origin = viewer.camera.positionWC;
    rayScratch.direction = viewer.camera.directionWC;
    return viewer.scene.globe.pick(rayScratch, viewer.scene);
}

export function animationZoom(viewer, amount) {
    let focus = getCameraFocus(viewer);
    let orientation;

    if (focus !== undefined) {
        orientation = {
            direction: viewer.camera.direction,
            up: viewer.camera.up
        };
    }
    else {
        const ray = new Cesium.Ray(viewer.camera.worldToCameraCoordinatesPoint(viewer.scene.globe.ellipsoid.cartographicToCartesian(viewer.camera.positionCartographic)), viewer.camera.directionWC);
        focus = Cesium.IntersectionTests.grazingAltitudeLocation(ray, viewer.scene.globe.ellipsoid);

        orientation = {
            heading: viewer.camera.heading,
            pitch: viewer.camera.pitch,
            roll: viewer.camera.roll
        };
    }
    const cartesian3Scratch = new Cesium.Cartesian3();
    const direction = Cesium.Cartesian3.subtract(viewer.camera.position, focus, cartesian3Scratch);
    const movementVector = Cesium.Cartesian3.multiplyByScalar(direction, amount, direction);
    const endPosition = Cesium.Cartesian3.add(focus, movementVector, focus);

    viewer.camera.flyTo({
        destination: endPosition,
        orientation: orientation,
        duration: 0.5,
        convert: false
    });
}

export function cameraResetTilt(viewer, heading, pitch, roll) {
    let destination;
    const orientation = {
        heading: heading,
        pitch: pitch,
        roll: roll
    };
    const original = Cesium.Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position);
    const focus = getCameraFocus(viewer);
    if (focus === undefined) {
        destination = viewer.camera.position;
    }
    else {
        const targetFocus = Cesium.Ellipsoid.WGS84.cartesianToCartographic(focus);
        destination = Cesium.Cartesian3.fromRadians(targetFocus.longitude, targetFocus.latitude, original.height);
    }

    viewer.camera.flyTo({
        destination: destination,
        orientation: orientation,
        duration: 0.5,
        convert: false
    });
}

export function cameraReset3D(viewer, radius, offset) {
    let destination;
    const focus = getCameraFocus(viewer);
    if (focus === undefined) {
        destination = viewer.camera.position;
    }
    else {
        destination = focus;
    }

    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(destination, radius), {
        offset: offset,
        duration: 0.5
    });
}

export function enableTiltCesium(viewer, enable) {
    viewer.scene.screenSpaceCameraController.enableTilt = enable;
}

export function getMarkerSVG(color, stroke) {
    let marker_pin_svg = '<svg width="40px" height="40px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">';
    if (!stroke) {
        marker_pin_svg += '<path style="fill:' + color + ';" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />';
    } else {
        marker_pin_svg += '<path style="fill:' + color + '; stroke-width:1; stroke: #fff; " d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />';
    }
    marker_pin_svg += '</svg>';
    marker_pin_svg = 'data:image/svg+xml;base64,' + window.btoa(marker_pin_svg);

    return marker_pin_svg;
}

export function generateMarkerImage(color, highlight) {
    const image = new Image();
    image.style.color = color;
    image.src = getMarkerSVG(color, highlight);

    return image;
}

export function getColorValue(color, opacity) {
    return Cesium.Color.fromCssColorString(color).withAlpha(opacity);
}

export function pickAnnotations(viewer, position) {
    const pickedObjects = viewer.scene.drillPick(position, 10);
    const retObjects = [];
    for (let i = 0; i < pickedObjects.length; i++) {
        if (pickedObjects[i].id === undefined) continue;
        if (pickedObjects[i].id._id === undefined) continue;
        if (pickedObjects[i].id._id.toString().includes("Marker") ||
            pickedObjects[i].id._id.toString().includes("Polygon") ||
            pickedObjects[i].id._id.toString().includes("Line") ||
            pickedObjects[i].id._id.toString().includes("Slope") ||
            pickedObjects[i].id._id.toString().includes("Angle")) {
            retObjects.push(pickedObjects[i]);
        }
    }

    return retObjects;
}

export function addCirclePoints(viewer, position, pointsArray, width = 10, id) {
    if (id === undefined) {
        pointsArray.push(viewer.entities.add({
            position: Cesium.Ellipsoid.WGS84.cartographicToCartesian(position),
            point: {
                pixelSize: width,
                color: getColorValue('red', 1),
                outlineWidth: 1,
                outlineColor: Cesium.Color.BEIGE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
        }));
    } else {
        pointsArray.push(viewer.entities.add({
            position: Cesium.Ellipsoid.WGS84.cartographicToCartesian(position),
            point: {
                pixelSize: width,
                color: getColorValue('red', 1),
                outlineWidth: 1,
                outlineColor: Cesium.Color.BEIGE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            id: "pointline_" + id,
        }));
    }
}