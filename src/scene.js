import * as THREE from 'three';

export class Scene {
  constructor(container) {
    this.container = container;
    
    if (!container) {
      console.error('[v0] Canvas container not found');
      return;
    }
    
    console.log('[v0] Scene constructor called');
    console.log('[v0] Container dimensions:', container.clientWidth, 'x', container.clientHeight);
    
    // Initialize immediately if container has dimensions
    if (container.clientWidth > 0 && container.clientHeight > 0) {
      console.log('[v0] Container has valid dimensions, initializing immediately');
      this.initThreeJS();
    } else {
      // Wait for container to have dimensions
      console.log('[v0] Waiting for container dimensions...');
      setTimeout(() => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
          console.log('[v0] Container now has dimensions:', container.clientWidth, 'x', container.clientHeight);
          this.initThreeJS();
        } else {
          console.error('[v0] Container still has no dimensions after timeout');
        }
      }, 500);
    }
  }

  initThreeJS() {
    console.log('[v0] Starting Three.js initialization');
    
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    
    console.log('[v0] Final canvas size:', this.width, 'x', this.height);
    
    if (this.width === 0 || this.height === 0) {
      console.error('[v0] Container has invalid dimensions, cannot initialize');
      return;
    }
    
    // Initialize Three.js
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    console.log('[v0] Three.js Scene created');

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      10000
    );
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(0, 0, 0);
    console.log('[v0] Camera created and positioned');

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false,
      precision: 'highp',
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Clear any existing canvas elements
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    
    this.container.appendChild(this.renderer.domElement);
    console.log('[v0] WebGL Renderer created and appended to container');

    // Lighting
    this.setupLighting();

    // Grid
    this.addGrid();

    // Helpers
    this.addHelpers();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Camera controls
    this.setupCameraControls();
    
    // Start rendering
    this.startAnimation();
    console.log('[v0] Scene initialization complete');
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 150, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -300;
    directionalLight.shadow.camera.right = 300;
    directionalLight.shadow.camera.top = 300;
    directionalLight.shadow.camera.bottom = -300;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-100, 80, -100);
    this.scene.add(pointLight);
    console.log('[v0] Lighting setup complete');
  }

  addGrid() {
    const gridHelper = new THREE.GridHelper(500, 50, 0x444444, 0x222222);
    this.scene.add(gridHelper);
    console.log('[v0] Grid added');
  }

  addHelpers() {
    const axesHelper = new THREE.AxesHelper(50);
    this.scene.add(axesHelper);
    console.log('[v0] Axes helper added');
  }

  setupCameraControls() {
    this.cameraState = {
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
    };

    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) { // Right click only
        this.cameraState.isDragging = true;
        this.cameraState.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.cameraState.isDragging && e.button === 2) {
        const deltaX = e.clientX - this.cameraState.previousMousePosition.x;
        const deltaY = e.clientY - this.cameraState.previousMousePosition.y;

        const rotationSpeed = 0.005;
        
        // Rotate around Y axis (horizontal movement)
        const quaternionY = new THREE.Quaternion();
        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
        this.camera.position.applyQuaternion(quaternionY);

        // Rotate around local X axis (vertical movement)
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.camera.quaternion);
        const quaternionX = new THREE.Quaternion();
        quaternionX.setFromAxisAngle(right, deltaY * rotationSpeed);
        this.camera.position.applyQuaternion(quaternionX);

        this.camera.lookAt(0, 0, 0);
        this.cameraState.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    document.addEventListener('mouseup', () => {
      this.cameraState.isDragging = false;
    });

    // Prevent context menu on right click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('wheel', (e) => {
      if (e.target !== this.renderer.domElement && !this.renderer.domElement.contains(e.target)) return;
      e.preventDefault();
      const zoomSpeed = 5;
      const direction = this.camera.getWorldDirection(new THREE.Vector3()).normalize();
      this.camera.position.addScaledVector(direction, e.deltaY > 0 ? zoomSpeed : -zoomSpeed);
    });
  }

  startAnimation() {
    console.log('[v0] Animation loop started');
    const animate = () => {
      requestAnimationFrame(animate);
      this.render();
    };
    animate();
  }

  onWindowResize() {
    if (!this.renderer) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }
}
