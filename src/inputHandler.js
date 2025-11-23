import * as THREE from 'three';

export class InputHandler {
  constructor(scene, tubeManager) {
    this.scene = scene;
    this.sceneThreeJS = scene.getScene();
    this.camera = scene.getCamera();
    this.renderer = scene.getRenderer();
    this.tubeManager = tubeManager;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.draggedTube = null;
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.dragPoint = new THREE.Vector3();

    this.snapAngles = [0, 15, 30, 45, 60, 90, 120, 135, 150, 180];
    this.snapDistance = 20;
    this.snapGridSize = 10;
    this.enableSnapping = true;

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => this.onMouseClick(e));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  getMousePosition(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onMouseClick(event) {
    if (event.button !== 0) return;
    this.getMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const tubes = this.tubeManager.getTubes();
    const intersects = this.raycaster.intersectObjects(
      tubes.map((t) => t.mesh),
      true
    );

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const clickedTube = tubes.find(
        (t) => t.mesh === clickedMesh.parent || t.mesh.children.includes(clickedMesh)
      );
      this.tubeManager.selectTube(clickedTube);
    } else {
      this.tubeManager.selectTube(null);
    }
  }

  onMouseDown(event) {
    if (event.button !== 0) return;
    this.getMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const tubes = this.tubeManager.getTubes();
    const intersects = this.raycaster.intersectObjects(
      tubes.map((t) => t.mesh),
      true
    );

    if (intersects.length > 0) {
      this.draggedTube = tubes.find(
        (t) => t.mesh === intersects[0].object.parent || t.mesh.children.includes(intersects[0].object)
      );
      if (this.draggedTube) {
        this.dragPlane.setFromNormalAndCoplanarPoint(
          this.camera.getWorldDirection(new THREE.Vector3()).negate(),
          this.draggedTube.mesh.position
        );
      }
    }
  }

  onMouseMove(event) {
    if (!this.draggedTube) return;

    this.getMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPoint);

    let snappedPosition = this.dragPoint.clone();
    if (this.enableSnapping) {
      snappedPosition = this.snapToGrid(snappedPosition);
    }

    this.tubeManager.updateTubePosition(this.draggedTube, snappedPosition);
  }

  onMouseUp(event) {
    this.draggedTube = null;
  }

  snapToGrid(position) {
    const snapped = position.clone();
    snapped.x = Math.round(snapped.x / this.snapGridSize) * this.snapGridSize;
    snapped.y = Math.round(snapped.y / this.snapGridSize) * this.snapGridSize;
    snapped.z = Math.round(snapped.z / this.snapGridSize) * this.snapGridSize;
    return snapped;
  }

  snapAngle(angleDegrees) {
    let closestAngle = this.snapAngles[0];
    let minDifference = Math.abs(angleDegrees - closestAngle);

    for (let angle of this.snapAngles) {
      const difference = Math.abs(angleDegrees - angle);
      if (difference < minDifference) {
        minDifference = difference;
        closestAngle = angle;
      }
    }

    return closestAngle;
  }

  onKeyDown(event) {
    if (!this.tubeManager.selectedTube) return;

    const rotationStep = Math.PI / 12; // 15 degrees
    const currentRotation = this.tubeManager.selectedTube.getRotation().clone();

    switch (event.key) {
      case 'x':
      case 'X':
        currentRotation.x += rotationStep;
        this.tubeManager.updateTubeRotation(this.tubeManager.selectedTube, currentRotation);
        event.preventDefault();
        break;
      case 'y':
      case 'Y':
        currentRotation.y += rotationStep;
        this.tubeManager.updateTubeRotation(this.tubeManager.selectedTube, currentRotation);
        event.preventDefault();
        break;
      case 'z':
      case 'Z':
        currentRotation.z += rotationStep;
        this.tubeManager.updateTubeRotation(this.tubeManager.selectedTube, currentRotation);
        event.preventDefault();
        break;
      case 'Delete':
        this.tubeManager.removeTube(this.tubeManager.selectedTube);
        this.tubeManager.selectTube(null);
        event.preventDefault();
        break;
      case 'd':
      case 'D':
        this.duplicateTube();
        event.preventDefault();
        break;
      case 's':
      case 'S':
        this.enableSnapping = !this.enableSnapping;
        console.log(`Snapping ${this.enableSnapping ? 'enabled' : 'disabled'}`);
        event.preventDefault();
        break;
    }
  }

  duplicateTube() {
    if (!this.tubeManager.selectedTube) return;
    const original = this.tubeManager.selectedTube;
    const config = original.config;
    const newTube = this.tubeManager.createTube(config);
    const offsetPos = original.getPosition().clone();
    offsetPos.x += 20;
    newTube.setPosition(offsetPos);
    this.tubeManager.selectTube(newTube);
  }

  setSnapping(enabled) {
    this.enableSnapping = enabled;
  }

  setSnapGridSize(size) {
    this.snapGridSize = size;
  }
}
