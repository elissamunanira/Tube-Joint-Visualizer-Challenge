import * as THREE from 'three';

export class JointDetector {
  constructor() {
    this.joints = [];
    this.detectionDistance = 100;
    this.intersectionThreshold = 0.1;
  }

  // Main detection method - checks if two tubes form a valid joint
  detectJoint(tube1, tube2) {
    const pos1 = tube1.mesh.position;
    const pos2 = tube2.mesh.position;
    const distance = pos1.distanceTo(pos2);

    if (distance > this.detectionDistance) {
      return null;
    }

    // Get tube orientations
    const dir1 = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(tube1.mesh.quaternion)
      .normalize();
    const dir2 = new THREE.Vector3(0, 0, 1)
      .applyQuaternion(tube2.mesh.quaternion)
      .normalize();

    // Calculate angle between tubes
    const angle = Math.acos(Math.max(-1, Math.min(1, dir1.dot(dir2))));
    const angleDegrees = (angle * 180) / Math.PI;

    // Check if tubes intersect or are very close
    const tubeIntersection = this.checkTubeIntersection(tube1, tube2);

    if (tubeIntersection) {
      return {
        tube1,
        tube2,
        position: tubeIntersection.position,
        angle: angleDegrees,
        distance: distance,
        strength: tubeIntersection.strength, // 0-1, how well they intersect
      };
    }

    return null;
  }

  // Check if two rectangular tubes intersect in 3D space
  checkTubeIntersection(tube1, tube2) {
    const box1 = this.getTubeBoundingBox(tube1);
    const box2 = this.getTubeBoundingBox(tube2);

    // Check if bounding boxes intersect
    if (!box1.intersectsBox(box2)) {
      return null;
    }

    // Calculate intersection point as center of overlap
    const intersection = new THREE.Box3();
    intersection.copy(box1);
    intersection.intersect(box2);

    const intersectionSize = new THREE.Vector3();
    intersection.getSize(intersectionSize);

    const strength = Math.min(
      intersectionSize.x / (tube1.config.width + tube2.config.width),
      intersectionSize.y / (tube1.config.height + tube2.config.height),
      intersectionSize.z / (tube1.config.length + tube2.config.length)
    );

    return {
      position: intersection.getCenter(new THREE.Vector3()),
      strength: Math.max(0, Math.min(1, strength * 10)), // Normalize strength 0-1
    };
  }

  // Get tube's oriented bounding box
  getTubeBoundingBox(tube) {
    const { width, height, length } = tube.config;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfLength = length / 2;

    const box = new THREE.Box3(
      new THREE.Vector3(-halfWidth, -halfHeight, -halfLength),
      new THREE.Vector3(halfWidth, halfHeight, halfLength)
    );

    // Transform box by tube's position and rotation
    const matrix = new THREE.Matrix4();
    matrix.compose(tube.mesh.position, tube.mesh.quaternion, new THREE.Vector3(1, 1, 1));

    box.applyMatrix4(matrix);
    return box;
  }

  // Validate if angle is suitable for a joint
  isValidJointAngle(angleDegrees) {
    const validAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180];
    const tolerance = 8;

    return validAngles.some((angle) => Math.abs(angleDegrees - angle) < tolerance);
  }

  // Calculate joint dimensions
  calculateJointDimensions(joint) {
    const { tube1, tube2 } = joint;
    const overlapWidth = Math.min(tube1.config.width, tube2.config.width);
    const overlapHeight = Math.min(tube1.config.height, tube2.config.height);

    return {
      width: overlapWidth,
      height: overlapHeight,
      angle: joint.angle,
      distance: joint.distance,
    };
  }
}
