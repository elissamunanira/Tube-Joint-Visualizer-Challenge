import * as THREE from "three";
contextBridge.exposeInMainWorld("THREE", THREE);


const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  nodeVersion: process.versions.node,
});
