# Tube Joint Visualizer

An interactive desktop application for visualizing and manipulating rectangular/square tube joints at various angles. Create complex 3D tube assemblies with real-time joint detection and export in multiple formats.

## Features

- **3D Tube Visualization**: Create, manipulate, and visualize rectangular or square tubes in a dynamic 3D workspace
- **Interactive Controls**: Click to select, drag to move, keyboard shortcuts for rotation and duplication
- **Smart Joint Detection**: Automatic detection and visualization of valid joints with strength indicators (color-coded)
- **Grid Snapping**: Optional grid-based snapping for precise positioning (customizable snap size)
- **Multiple View Modes**: Toggle between wireframe and solid rendering
- **Undo/Redo System**: Full history management with up to 50 saved states
- **Multi-Format Export**: Export assemblies to JSON, OBJ, or CSV formats
- **Import Scenes**: Load previously saved JSON scenes
- **Professional UI**: Tabbed interface for organized controls and settings
- **Standalone Executable**: Packaged with Electron for easy distribution

## Project Structure

\`\`\`
tube-joint-visualizer/
├── src/
│   ├── main.js                  # Electron main process
│   ├── preload.js              # Electron preload script
│   ├── renderer.js             # Main renderer initialization
│   ├── scene.js                # Three.js scene management
│   ├── tube.js                 # Tube geometry and properties
│   ├── tubeManager.js          # Tube lifecycle and management
│   ├── jointDetector.js        # Advanced joint detection
│   ├── inputHandler.js         # User input and interactions
│   ├── historyManager.js       # Undo/redo system
│   ├── exportManager.js        # Multi-format export
│   ├── ui.js                   # UI controls and panel
│   └── styles.css              # Application styling
├── assets/                     # Icons and images
├── index.html                  # Main HTML file
├── package.json                # Dependencies and scripts
├── CHANGELOG.md                # Version history
└── README.md                   # This file
\`\`\`

## Installation

### Prerequisites
- Node.js 14+ and npm

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone [https://github.com/yourusername/tube-joint-visualizer.git](https://github.com/elissamunanira/Tube-Joint-Visualizer-Challenge.git)
   cd tube-joint-visualizer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

## Usage

### Development Mode

Run the application with development tools enabled:

\`\`\`bash
npm run dev
\`\`\`

Or use the start command:

\`\`\`bash
npm start
\`\`\`

This launches the app with DevTools open for debugging.

### Building the Application

#### For Development/Testing

\`\`\`bash
npm run pack
\`\`\`

Creates a packaged version without signing.

#### For Production Distribution

\`\`\`bash
npm run build:electron
\`\`\`

Or for final distribution builds:

\`\`\`bash
npm run dist
\`\`\`

### Executable Locations

After building, find your platform-specific executable:

- **Windows**: 
  - `dist/Tube Joint Visualizer Setup 1.0.0.exe` (Installer)
  - `dist/Tube Joint Visualizer 1.0.0.exe` (Portable)

- **macOS**: 
  - `dist/Tube Joint Visualizer-1.0.0.dmg` (DMG Installer)
  - `dist/Tube Joint Visualizer-1.0.0.zip` (ZIP Archive)

- **Linux**: 
  - `dist/tube-joint-visualizer-1.0.0.AppImage` (AppImage)
  - `dist/tube-joint-visualizer-1.0.0.deb` (Debian Package)

## User Controls

### Mouse Controls
- **Click**: Select a tube
- **Drag**: Move selected tube
- **Right Mouse + Drag**: Rotate camera
- **Scroll Wheel**: Zoom in/out

### Keyboard Shortcuts
- **X/Y/Z**: Rotate selected tube around respective axes (15° increments)
- **D**: Duplicate selected tube
- **S**: Toggle grid snapping on/off
- **Delete**: Remove selected tube
- **Ctrl+Z**: Undo (via UI button)
- **Ctrl+Y**: Redo (via UI button)

### Control Panel

#### Tubes Tab
- **Tube Type**: Choose between square and rectangular tubes
- **Dimensions**: Set width, height, thickness, and length
- **Joint Angle**: Reference angle for joint creation (informational)
- **Add Tube Button**: Create a new tube with configured parameters

#### View Tab
- **Rendering Mode**: Toggle between wireframe and solid views
- **Display Options**: Show/hide grid, joint previews, and coordinate axes

#### Settings Tab
- **Grid Snap Size**: Adjust snapping precision (1-100 units)
- **Snapping**: Enable/disable grid snapping
- **History**: Undo/redo controls with history counter
- **Export**: Download scenes in JSON, OBJ, or CSV formats
- **Import**: Load previously saved JSON scenes
- **Clear All**: Remove all tubes from workspace

## Features Detailed

### Tube Creation
1. Configure tube parameters in the **Tubes** tab:
   - Choose tube type (square/rectangular)
   - Set dimensions (width, height, thickness, length)
2. Click **Add Tube**
3. New tube appears in the 3D workspace (offset from origin)

### Tube Positioning
- **Drag**: Click and hold any tube, then drag to move
- **Snapping**: When enabled, tubes snap to grid automatically
- **Rotation**: Select a tube and press X, Y, or Z to rotate around those axes
- **Duplication**: Press D with a tube selected to create a copy

### Joint Detection
- When tubes are positioned close (within 100 units), joint detection activates
- Joint color indicates quality:
  - **Green**: Perfect 90° or 0° angles
  - **Blue**: Good angle alignment (within 15° of perfect)
  - **Yellow**: Weak alignment (strength > 50%)
  - **Red**: Poor joint quality
- Joint visualization shows:
  - Central sphere at intersection
  - Connection lines to both tubes
  - Highlight ring for emphasis

### Export Formats

#### JSON Export
- Complete scene data including all tubes, positions, and rotations
- Easily reimported via the Import button
- Human-readable format for manual editing

#### OBJ Export
- Wavefront OBJ format for CAD software compatibility
- Can be imported into Blender, FreeCAD, or other 3D tools
- Includes vertex and face definitions for all tubes

#### CSV Export
- Spreadsheet-compatible format
- Useful for data analysis and documentation
- Includes all tube dimensions and transformations

### History Management
- Up to 50 actions saved in history
- Undo button: Go back one step
- Redo button: Go forward one step
- History counter shows current position and total states
- Buttons disable automatically when at history limits

## Git Workflow

This project follows professional development practices:

### Commit Structure
- **feat**: New features (e.g., `feat: add tube joint detection`)
- **fix**: Bug fixes (e.g., `fix: resolve grid snapping issues`)
- **docs**: Documentation (e.g., `docs: update README`)
- **style**: UI/styling (e.g., `style: enhance control panel design`)
- **refactor**: Code restructuring (e.g., `refactor: optimize joint detection`)

### Example Commits
\`\`\`
feat: implement 3D tube visualization with Three.js
feat: add grid snapping and angle validation
fix: correct joint detection bounding box calculation
docs: add comprehensive README with usage guide
\`\`\`

## Architecture Overview

### Scene Management (scene.js)
- Initializes Three.js scene with proper lighting
- Handles camera controls (pan, zoom, rotate)
- Manages grid and coordinate axes helpers
- Responsive to window resizing

### Tube System
- **tube.js**: Individual tube geometry and properties
- **tubeManager.js**: Lifecycle management, selection, and removal
- **jointDetector.js**: Advanced joint detection using bounding boxes

### User Interaction (inputHandler.js)
- Raycasting for tube selection
- Drag-and-drop positioning
- Keyboard input processing
- Grid snapping implementation

### Data Management
- **historyManager.js**: Undo/redo state tracking
- **exportManager.js**: Multi-format export/import
- **ui.js**: User interface and control panel

## Troubleshooting

### Application won't start
- Ensure Node.js 14+ is installed: `node --version`
- Verify Three.js is installed: `npm list three`
- Check console for error messages: `npm run dev`

### Performance issues
- Switch to solid view (wireframe can be GPU-intensive)
- Reduce number of visible tubes
- Close other applications for more resources

### Tubes not snapping correctly
- Check grid snap size (Settings tab)
- Ensure snapping is enabled (green status indicator)
- Verify snap size is appropriate for your coordinate system

### Export file not found
- Check your Downloads folder or specified download location
- Verify browser/OS download settings
- Try exporting again to a known location

### Input not responding
- Ensure application window is focused
- Verify keyboard isn't locked by Caps Lock or Num Lock
- Try refreshing the scene (press R if implemented)

## Future Enhancements

- [ ] Advanced tube profiles (C-channel, I-beam, pipe)
- [ ] Joint fabrication specifications
- [ ] Assembly visualization with materials
- [ ] Measurement and dimensioning tools
- [ ] CAD file import (STEP, IGES)
- [ ] Collaborative editing via network
- [ ] Physics simulation for structural analysis
- [ ] Custom material properties and rendering
- [ ] Measurement annotations in 3D view
- [ ] Assembly cost estimation

## Performance Tips

- **For Large Assemblies**: Export to OBJ and use in specialized CAD software
- **For Real-time Editing**: Keep grid snapping enabled for stability
- **For Precision**: Use CSV export for data verification
- **For Sharing**: Use JSON format for easy reimport by others

## System Requirements

- **Windows**: Windows 7+, 64-bit recommended
- **macOS**: macOS 10.13+, 64-bit
- **Linux**: Ubuntu 18.04+, Fedora 26+, or equivalent

- **RAM**: 512 MB minimum, 2 GB recommended
- **GPU**: Any GPU with WebGL support
- **Storage**: 200 MB free disk space

## License

MIT License - Feel free to use this project for educational, personal, and commercial purposes.

## Support & Contributing

### Reporting Issues
Create a GitHub issue with:
- Clear description of the problem
- Steps to reproduce
- Screenshots if applicable
- System information

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes with clear messages
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Authors

- **Lead Developer**: Your Name
- **Contributors**: Community feedback welcome

## Acknowledgments

- Built with [Three.js](https://threejs.org/)
- Packaged with [Electron](https://www.electronjs.org/)
- Built by [Electron Builder](https://www.electron.build/)

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Production Ready

For detailed version history, see [CHANGELOG.md](CHANGELOG.md)
