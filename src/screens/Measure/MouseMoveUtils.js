import { Cesium } from '../../global/constant';

// material
const lineMaterialProperty = new Cesium.PolylineOutlineMaterialProperty({
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.BEIGE,
    outlineWidth: 1
});

const depthFailProperty = new Cesium.PolylineDashMaterialProperty({
    color: Cesium.Color.RED,
    outlineWidth: 1,
    outlineColor: Cesium.Color.WHITE,
    dashLength: 3,
});

export function horizontalLineMouseMoveAction(viewer, linePoints, lineName/* id || name */, clamp = false) {
    const _lineDrawing = viewer.entities.add({
        polyline: {
            positions: new Cesium.CallbackProperty(function () {
                return Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(linePoints);
            }, false),
            width: 6,
            material: lineMaterialProperty,
            depthFailMaterial: depthFailProperty,
            clampToGround: clamp //line goes underground without clamping the whole line while using dynamic positions and depthFailMaterial is unsupported
        },
        // id: lineName,
        // name: lineName
    });

    return _lineDrawing;
}

export function verticalLineMouseMoveAction() {

}

export function polygonMouseMoveAction() {

}

export function slopeLineMouseMoveAction() {

}

export function angleLineMouseMoveAction() {

}