import { ExportManager } from './exportManager.js';

export class UI {
  constructor(tubeManager, inputHandler, historyManager) {
    this.tubeManager = tubeManager;
    this.inputHandler = inputHandler;
    this.historyManager = historyManager;
    this.tubeCounter = 0;
    this.currentTab = 'tubes';

    this.setupUI();
  }

  setupUI() {
    const panel = document.getElementById('controls-panel');

    const tabsHtml = `
      <div class="tabs">
        <button class="tab-button active" data-tab="tubes">Tubes</button>
        <button class="tab-button" data-tab="view">View</button>
        <button class="tab-button" data-tab="settings">Settings</button>
      </div>
    `;
    panel.innerHTML += tabsHtml;

    const tubesTabHtml = `
      <div class="tab-content active" id="tab-tubes">
        <div class="control-group">
          <label for="tubeType">Tube Type</label>
          <select id="tubeType">
            <option value="square">Square</option>
            <option value="rectangular">Rectangular</option>
          </select>
        </div>

        <div class="control-group">
          <label for="tubeWidth">Width</label>
          <input type="number" id="tubeWidth" value="20" step="1" min="5" />
        </div>

        <div class="control-group">
          <label for="tubeHeight">Height</label>
          <input type="number" id="tubeHeight" value="20" step="1" min="5" />
        </div>

        <div class="control-group">
          <label for="tubeThickness">Thickness</label>
          <input type="number" id="tubeThickness" value="2" step="0.5" min="0.5" />
        </div>

        <div class="control-group">
          <label for="tubeLength">Length</label>
          <input type="number" id="tubeLength" value="100" step="5" min="10" />
        </div>

        <div class="control-group">
          <button id="addTubeBtn">Add Tube</button>
        </div>

        <div class="control-group">
          <label for="jointAngle">Joint Angle (°)</label>
          <input type="number" id="jointAngle" value="90" step="5" min="0" max="180" />
        </div>
      </div>
    `;
    panel.innerHTML += tubesTabHtml;

    const viewTabHtml = `
      <div class="tab-content" id="tab-view">
        <div class="control-group">
          <label>Rendering Mode</label>
          <div class="button-group">
            <button id="wireframeBtn">Wireframe</button>
            <button id="solidBtn">Solid</button>
          </div>
        </div>

        <div class="control-group">
          <label>Display Options</label>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <label style="display: flex; align-items: center; font-size: 13px; margin-bottom: 0; font-weight: normal;">
              <input type="checkbox" id="showGridCheckbox" checked style="width: auto; margin-right: 8px;" />
              Show Grid
            </label>
            <label style="display: flex; align-items: center; font-size: 13px; margin-bottom: 0; font-weight: normal;">
              <input type="checkbox" id="showJointsCheckbox" checked style="width: auto; margin-right: 8px;" />
              Show Joints
            </label>
            <label style="display: flex; align-items: center; font-size: 13px; margin-bottom: 0; font-weight: normal;">
              <input type="checkbox" id="showAxisCheckbox" checked style="width: auto; margin-right: 8px;" />
              Show Axes
            </label>
          </div>
        </div>
      </div>
    `;
    panel.innerHTML += viewTabHtml;

    const settingsTabHtml = `
      <div class="tab-content" id="tab-settings">
        <div class="control-group">
          <label for="snapGridSize">Grid Snap Size</label>
          <input type="number" id="snapGridSize" value="10" step="1" min="1" max="100" />
        </div>

        <div class="control-group">
          <label>Snapping</label>
          <div class="button-group">
            <button id="snapOnBtn">Snap On</button>
            <button id="snapOffBtn">Snap Off</button>
          </div>
        </div>

        <div class="control-group">
          <label>History</label>
          <div class="button-group">
            <button id="undoBtn">Undo</button>
            <button id="redoBtn">Redo</button>
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 8px;">
            <span id="historyInfo">0 / 0</span>
          </div>
        </div>

        <div class="control-group">
          <label>Export</label>
          <button id="exportJsonBtn">Export JSON</button>
          <button id="exportObjBtn">Export OBJ</button>
          <button id="exportCsvBtn">Export CSV</button>
        </div>

        <div class="control-group">
          <label>Import</label>
          <input type="file" id="importFileInput" accept=".json" style="display: none;" />
          <button id="importBtn">Import Scene</button>
        </div>

        <div class="control-group">
          <label>Clear</label>
          <button id="clearAllBtn" style="background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%); box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);">Clear All</button>
        </div>
      </div>
    `;
    panel.innerHTML += settingsTabHtml;

    const infoHtml = `
      <div class="control-group">
        <label>Status & Info</label>
        <div id="tubeInfo">
          <div>Tubes: <strong id="tubeCount" style="display: inline; color: #4a9eff;">0</strong></div>
          <div>Selected: <span id="selectedTube" style="color: #888;">None</span></div>
          <strong style="margin-top: 12px;">Quick Keys:</strong>
          <div style="font-size: 11px; margin-top: 4px;">
            <div>D - Duplicate</div>
            <div>S - Toggle Snap</div>
            <div>X/Y/Z - Rotate</div>
            <div>Delete - Remove</div>
          </div>
        </div>
      </div>
    `;
    panel.innerHTML += infoHtml;

    this.setupEventListeners();
    this.updateHistoryUI();
  }

  setupEventListeners() {
    document.querySelectorAll('.tab-button').forEach((btn) => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    document.getElementById('addTubeBtn').addEventListener('click', () => this.addTube());
    document.getElementById('wireframeBtn').addEventListener('click', () => this.toggleWireframe(true));
    document.getElementById('solidBtn').addEventListener('click', () => this.toggleWireframe(false));
    document.getElementById('snapOnBtn').addEventListener('click', () => this.toggleSnapping(true));
    document.getElementById('snapOffBtn').addEventListener('click', () => this.toggleSnapping(false));

    document.getElementById('undoBtn').addEventListener('click', () => this.undo());
    document.getElementById('redoBtn').addEventListener('click', () => this.redo());
    document.getElementById('exportJsonBtn').addEventListener('click', () => ExportManager.downloadJSON(this.tubeManager));
    document.getElementById('exportObjBtn').addEventListener('click', () => ExportManager.downloadOBJ(this.tubeManager));
    document.getElementById('exportCsvBtn').addEventListener('click', () => ExportManager.downloadCSV(this.tubeManager));
    document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFileInput').click());
    document.getElementById('importFileInput').addEventListener('change', (e) => this.importScene(e));
    document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
    document.getElementById('snapGridSize').addEventListener('change', (e) => {
      this.inputHandler.setSnapGridSize(parseFloat(e.target.value));
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach((btn) => btn.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  }

  addTube() {
    const type = document.getElementById('tubeType').value;
    const width = parseFloat(document.getElementById('tubeWidth').value);
    const height = parseFloat(document.getElementById('tubeHeight').value);
    const thickness = parseFloat(document.getElementById('tubeThickness').value);
    const length = parseFloat(document.getElementById('tubeLength').value);

    const config = { type, width, height, thickness, length };
    const tube = this.tubeManager.createTube(config);
    const randomOffset = 50;
    tube.setPosition({
      x: (Math.random() - 0.5) * randomOffset,
      y: this.tubeCounter * 30,
      z: (Math.random() - 0.5) * randomOffset,
    });

    this.tubeCounter++;
    document.getElementById('tubeCount').textContent = this.tubeManager.getTubes().length;
    this.saveToHistory();
  }

  toggleWireframe(isWireframe) {
    this.tubeManager.getTubes().forEach((tube) => {
      tube.mesh.children.forEach((child) => {
        if (child.material) {
          child.material.wireframe = isWireframe;
        }
      });
    });
  }

  toggleSnapping(enabled) {
    this.inputHandler.setSnapping(enabled);
  }

  saveToHistory() {
    const state = this.captureState();
    this.historyManager.saveState(state);
    this.updateHistoryUI();
  }

  captureState() {
    return this.tubeManager.getTubes().map((tube) => ({
      position: tube.getPosition().clone(),
      rotation: tube.getRotation().clone(),
      config: { ...tube.config },
    }));
  }

  undo() {
    const prevState = this.historyManager.undo();
    if (prevState) {
      this.restoreState(prevState);
      this.updateHistoryUI();
    }
  }

  redo() {
    const nextState = this.historyManager.redo();
    if (nextState) {
      this.restoreState(nextState);
      this.updateHistoryUI();
    }
  }

  restoreState(state) {
    this.tubeManager.getTubes().forEach((tube) => this.tubeManager.removeTube(tube));
    state.forEach((tubeState) => {
      const tube = this.tubeManager.createTube(tubeState.config);
      tube.setPosition(tubeState.position);
      tube.setRotation(tubeState.rotation);
    });
    document.getElementById('tubeCount').textContent = this.tubeManager.getTubes().length;
  }

  updateHistoryUI() {
    const canUndo = this.historyManager.canUndo();
    const canRedo = this.historyManager.canRedo();
    document.getElementById('undoBtn').disabled = !canUndo;
    document.getElementById('redoBtn').disabled = !canRedo;
    document.getElementById('historyInfo').textContent = `${this.historyManager.getCurrentIndex() + 1} / ${this.historyManager.getSize()}`;
  }

  async importScene(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const sceneData = await ExportManager.importJSON(file);
      this.tubeManager.getTubes().forEach((tube) => this.tubeManager.removeTube(tube));

      sceneData.tubes.forEach((tubeData) => {
        const tube = this.tubeManager.createTube(tubeData);
        tube.setPosition(tubeData.position);
        tube.setRotation(tubeData.rotation);
      });

      document.getElementById('tubeCount').textContent = this.tubeManager.getTubes().length;
      this.saveToHistory();
      alert('Scene imported successfully!');
    } catch (error) {
      alert(`Error importing scene: ${error.message}`);
    }

    e.target.value = '';
  }

  clearAll() {
    if (confirm('Are you sure you want to clear all tubes? This cannot be undone.')) {
      this.tubeManager.getTubes().forEach((tube) => this.tubeManager.removeTube(tube));
      document.getElementById('tubeCount').textContent = '0';
      this.saveToHistory();
    }
  }
}
