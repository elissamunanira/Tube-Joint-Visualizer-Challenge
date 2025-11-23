import * as THREE from 'three';
import { Tube } from './tube.js';
import { JointDetector } from './jointDetector.js';

export class TubeManager {
  constructor(scene) {
    this.scene = scene.getScene();
    this.tubes = [];
    this.selectedTube = null;
    this.tubeGroup = new THREE.Group();
    this.scene.add(this.tubeGroup);
    this.jointPreviews = [];
    
    this.jointDetectionDistance = 100;
    this.snapToJointAngle = true;
    this.validJointAngles = [30, 45, 60, 90, 120, 135, 150];
    this.jointDetector = new JointDetector(); // add joint detector for advanced detection
  }

  createTube(config) {
    const tube = new Tube(config);
    this.tubes.push(tube);
    this.tubeGroup.add(tube.mesh);
    return tube;
  }

  selectTube(tube) {
    if (this.selectedTube) {
      this.selectedTube.deselect();
    }
    this.selectedTube = tube;
    if (tube) {
      tube.select();
    }
  }

  updateTubePosition(tube, position) {
    tube.setPosition(position);
    this.updateJointPreviews();
  }

  updateTubeRotation(tube, rotation) {
    tube.setRotation(rotation);
    this.updateJointPreviews();
  }

  removeTube(tube) {
    const index = this.tubes.indexOf(tube);
    if (index > -1) {
      this.tubeGroup.remove(tube.mesh);
      this.tubes.splice(index, 1);
    }
    this.updateJointPreviews();
  }

  updateJointPreviews() {
    this.clearJointPreviews();
    const validJoints = [];

    for (let i = 0; i < this.tubes.length; i++) {
      for (let j = i + 1; j < this.tubes.length; j++) {
        const joint = this.jointDetector.detectJoint(this.tubes[i], this.tubes[j]);
        if (joint && this.jointDetector.isValidJointAngle(joint.angle)) {
          validJoints.push(joint);
          this.showJointPreview(joint);
        }
      }
    }

    return validJoints;
  }

  showJointPreview(joint) {
    const previewGroup = new THREE.Group();

    // Color based on joint strength
    const color = this.getJointColor(joint.strength, joint.angle);

    // Main joint sphere
    const geometry = new THREE.SphereGeometry(8, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
    });
    const sphere = new THREE.Mesh(geometry, material);
    previewGroup.add(sphere);

    // Highlight ring
    const ringGeometry = new THREE.TorusGeometry(10, 2, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    previewGroup.add(ring);

    // Connection lines
    const lineGeometry = new THREE.BufferGeometry();
    const points = [joint.tube1.mesh.position, joint.position, joint.tube2.mesh.position];
    lineGeometry.setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      linewidth: 3,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    previewGroup.add(line);

    previewGroup.position.copy(joint.position);
    this.tubeGroup.add(previewGroup);
    this.jointPreviews.push(previewGroup);

    // Store joint info for later reference
    previewGroup.userData = joint;
  }

  // Get color based on joint quality
  getJointColor(strength, angle) {
    if (angle === 90 || angle === 0) {
      // Perfect angles - green
      return 0x4caf50;
    } else if (Math.abs(angle - 90) < 15 || Math.abs(angle - 0) < 15) {
      // Good angles - blue
      return 0x2196f3;
    } else if (strength > 0.5) {
      // Weak alignment - yellow
      return 0xffc107;
    }
    // Poor joint - red
    return 0xff6b6b;
  }

  clearJointPreviews() {
    this.jointPreviews.forEach((preview) => this.tubeGroup.remove(preview));
    this.jointPreviews = [];
  }

  getTubes() {
    return this.tubes;
  }

  getSelectedTube() {
    return this.selectedTube;
  }
}
