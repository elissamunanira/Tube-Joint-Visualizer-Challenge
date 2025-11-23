import * as THREE from 'three';

export class Tube {
  constructor(config) {
    const { type = 'square', width = 20, height = 20, thickness = 2, length = 100 } = config;

    this.config = { type, width, height, thickness, length };
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Euler();
    this.selected = false;
    this.joints = [];

    this.mesh = this.createGeometry();
  }

  createGeometry() {
    const { width, height, thickness, length } = this.config;

    const group = new THREE.Group();

    // Outer geometry (visible walls)
    const outerGeometry = new THREE.BoxGeometry(width, height, length);
    const outerMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a9eff,
      shininess: 100,
      flatShading: false,
      metalness: 0.3,
    });

    const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
    outerMesh.castShadow = true;
    outerMesh.receiveShadow = true;
    group.add(outerMesh);

    // Inner geometry (creates hollow effect)
    const innerWidth = Math.max(0.1, width - 2 * thickness);
    const innerHeight = Math.max(0.1, height - 2 * thickness);
    const innerGeometry = new THREE.BoxGeometry(innerWidth, innerHeight, length + 2);

    const innerMaterial = new THREE.MeshPhongMaterial({
      color: 0x0a0a0a,
      side: THREE.BackSide,
      shininess: 30,
    });

    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    innerMesh.receiveShadow = true;
    group.add(innerMesh);

    group.castShadow = true;
    group.receiveShadow = true;

    return group;
  }

  setPosition(position) {
    this.position.copy(position);
    this.mesh.position.copy(position);
  }

  setRotation(rotation) {
    this.rotation.copy(rotation);
    this.mesh.rotation.copy(rotation);
  }

  select() {
    this.selected = true;
    this.mesh.children.forEach((child) => {
      if (child.material) {
        child.material.color.set(0xff9800);
      }
    });
  }

  deselect() {
    this.selected = false;
    this.mesh.children.forEach((child) => {
      if (child.material) {
        child.material.color.set(0x4a9eff);
      }
    });
  }

  getPosition() {
    return this.position;
  }

  getRotation() {
    return this.rotation;
  }

  addJoint(jointData) {
    this.joints.push(jointData);
  }

  getJoints() {
    return this.joints;
  }
}
