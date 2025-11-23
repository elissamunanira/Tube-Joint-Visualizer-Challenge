# Packaging Instructions

Complete guide for packaging the Tube Joint Visualizer as a standalone executable for distribution.

## Prerequisites

1. **Node.js & npm** installed (version 14+)
2. **Git** for version control
3. **Build tools** for your platform:
   - **Windows**: Visual C++ Build Tools
   - **macOS**: Xcode Command Line Tools
   - **Linux**: build-essential, libX11-dev

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

This installs Three.js, Electron, and electron-builder.

### 2. Build the Application

For development/testing:
\`\`\`bash
npm run pack
\`\`\`

For production distribution:
\`\`\`bash
npm run build:electron
\`\`\`

For maximum compatibility:
\`\`\`bash
npm run dist
\`\`\`

### 3. Locate Your Executable

The packaged application appears in the `dist/` directory.

## Platform-Specific Instructions

### Windows Packaging

**Generate Installers**:
\`\`\`bash
npm run dist
\`\`\`

**Output Files**:
- `Tube Joint Visualizer Setup 1.0.0.exe` - NSIS Installer
- `Tube Joint Visualizer 1.0.0.exe` - Portable executable
- `Tube Joint Visualizer 1.0.0.nsis.7z` - Archive

**Distribution**:
1. Host the `.exe` file on a server or cloud storage
2. Users download and run the installer
3. Application installs to `Program Files` or user-specified location

**Code Signing** (Optional):
\`\`\`javascript
// In package.json build config
"win": {
  "certificateFile": "path/to/certificate.pfx",
  "certificatePassword": "your-password",
  "signingHashAlgorithms": ["sha256"]
}
\`\`\`

### macOS Packaging

**Generate Installer**:
\`\`\`bash
npm run dist
\`\`\`

**Output Files**:
- `Tube Joint Visualizer-1.0.0.dmg` - DMG installer
- `Tube Joint Visualizer-1.0.0.zip` - ZIP archive
- `Tube Joint Visualizer-1.0.0.tar.gz` - Gzipped archive

**Distribution**:
1. Share the `.dmg` file (double-click mounts as virtual drive)
2. Or provide `.zip` for direct execution
3. Users drag application to Applications folder

**Code Signing** (Required for App Store):
\`\`\`bash
# Set up certificates first
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="your-password"
npm run dist
\`\`\`

### Linux Packaging

**Generate Packages**:
\`\`\`bash
npm run dist
\`\`\`

**Output Files**:
- `tube-joint-visualizer-1.0.0.AppImage` - Universal app image
- `tube-joint-visualizer-1.0.0.deb` - Debian package
- `tube-joint-visualizer-1.0.0.tar.gz` - Tarball

**Installation Methods**:

**AppImage** (Universal):
\`\`\`bash
chmod +x tube-joint-visualizer-1.0.0.AppImage
./tube-joint-visualizer-1.0.0.AppImage
\`\`\`

**Debian/Ubuntu**:
\`\`\`bash
sudo apt install ./tube-joint-visualizer-1.0.0.deb
tube-joint-visualizer
\`\`\`

**Generic Linux**:
\`\`\`bash
tar -xzf tube-joint-visualizer-1.0.0.tar.gz
cd tube-joint-visualizer
./tube-joint-visualizer
\`\`\`

## Customization

### Application Name & Branding

In `package.json`:
\`\`\`json
{
  "productName": "Tube Joint Visualizer",
  "build": {
    "appId": "com.example.tubejoint",
    "productName": "Tube Joint Visualizer"
  }
}
\`\`\`

### Version Number

In `package.json`:
\`\`\`json
{
  "version": "1.0.0"
}
\`\`\`

Update before each release.

### Application Icon

Place icon files in `assets/`:
- Windows: `icon.ico` (256x256)
- macOS: `icon.icns`
- Linux: `icon.png`

### File Associations

In `package.json`:
\`\`\`json
{
  "build": {
    "fileAssociations": [
      {
        "ext": "json",
        "name": "Tube Assembly",
        "role": "Editor"
      }
    ]
  }
}
\`\`\`

## Build Configuration

### Optimize Build Size

In `package.json`:
\`\`\`json
{
  "build": {
    "files": [
      "src/**/*",
      "index.html",
      "node_modules/**/*"
    ],
    "extraMetadata": {
      "main": "src/main.js"
    }
  }
}
\`\`\`

### Native Modules

If adding native modules:
\`\`\`bash
npm install --save-dev electron-rebuild
npm run rebuild
\`\`\`

## Testing the Build

### Test Before Release

1. **Run in dev mode**:
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Test packaged version**:
   \`\`\`bash
   npm run pack
   ./dist/win-unpacked/Tube\ Joint\ Visualizer.exe  # Windows
   \`\`\`

3. **Verify features**:
   - Create tubes
   - Detect joints
   - Export/import
   - Undo/redo
   - All UI controls

### Automated Testing

Add test script in `package.json`:
\`\`\`json
{
  "scripts": {
    "test": "echo 'Add your tests here'"
  }
}
\`\`\`

## Distribution

### Hosting Options

1. **GitHub Releases**:
   - Push files to GitHub
   - Create release with executables
   - Users download directly

2. **Cloud Storage** (Google Drive, Dropbox):
   - Upload `.exe`, `.dmg`, or `.AppImage`
   - Share public link

3. **Dedicated Server**:
   - Host on own server
   - Implement version checking
   - Auto-update capability

4. **Package Managers**:
   - Windows: Chocolatey
   - macOS: Homebrew
   - Linux: Ubuntu PPA

### Auto-Update Setup

In `package.json`:
\`\`\`json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "yourusername",
      "repo": "tube-joint-visualizer"
    }
  }
}
\`\`\`

## Troubleshooting

### Build Fails

**Issue**: Missing dependencies
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Issue**: Build tools not found (Windows)
- Install Visual C++ Build Tools
- Or use node-gyp: `npm install --global node-gyp`

### Executable Won't Run

- Check Windows Defender or antivirus (may block)
- Verify system requirements met
- Check logs in AppData/Roaming

### Code Signing Issues

- Verify certificate path is correct
- Check certificate expiration
- Ensure password is correct
- Test locally first before signing

## Version Management

### Before Release

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Test thoroughly
4. Commit changes: `git commit -am "v1.0.0 release"`
5. Tag release: `git tag v1.0.0`
6. Push: `git push --tags`

### Release Checklist

- [ ] All tests passing
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] Screenshots/demos prepared
- [ ] Build tested on all platforms
- [ ] Code signed (macOS/Windows)
- [ ] Installation tested
- [ ] Performance verified

## Performance Optimization

### Reduce Package Size

\`\`\`bash
npm install --save-dev asar
npm run build:electron
\`\`\`

### Enable Code Caching

In `main.js`:
\`\`\`javascript
app.commandLine.appendSwitch('js-code-cache-dir', path.join(app.getPath('userData'), 'cache'));
\`\`\`

## Security Considerations

- Never commit private keys or certificates
- Use environment variables for sensitive data
- Verify downloaded files after distribution
- Keep dependencies updated: `npm audit`
- Sign executables where possible

## Support & Documentation

For more information:
- [Electron Builder Docs](https://www.electron.build/)
- [Electron Security](https://www.electronjs.org/docs/tutorial/security)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

---

**Last Updated**: November 2025  
**Status**: Production Ready
