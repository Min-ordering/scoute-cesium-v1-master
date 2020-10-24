import { Cesium } from '../../global/constant';
import * as Utils from '../../rest/util';

export function horizontalLineLeftClickAction(viewer, position, linePointsArray) {
    Utils.addCirclePoints(viewer, position, linePointsArray, 10);
}

export function verticalLineLeftClickAction() {

}

export function polygonLineLeftClickAction() {

}

export function slopeLineLeftClickAction() {

}

export function angleLineLeftClickAction() {

}