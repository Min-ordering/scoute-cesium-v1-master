export const Cesium = require("cesium/Cesium");
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxOGEwZGFjOS0yMjNlLTQyMTQtODU3Mi1kNWU5M2FmYmE0YTkiLCJpZCI6MTE5OTUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjAyMDc5OTJ9.iDosftSqW8l_R4hEy5AHnlLNMbv5WGXqqdK-DiF9dBc";

export const SERVER_URL = "http://ec2-13-236-167-53.ap-southeast-2.compute.amazonaws.com/";
export const SERVER_STORAGE_URL = "http://ec2-13-236-167-53.ap-southeast-2.compute.amazonaws.com/storage";

export const LAYER_TYPES = {
    PointCloud: "PointCloud",
    Orthomosaic: "Orthomosaic",
    Model3D: "3DModel",
    DSM: "DSM",
    DTM: "DTM"
}