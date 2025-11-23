export class ExportManager {
  static exportToJSON(tubeManager) {
    const sceneData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      metadata: {
        tubeCount: tubeManager.getTubes().length,
        savedBy: 'Tube Joint Visualizer',
      },
      tubes: tubeManager.getTubes().map((tube) => ({
        type: tube.config.type,
        width: tube.config.width,
        height: tube.config.height,
        thickness: tube.config.thickness,
        length: tube.config.length,
        position: {
          x: tube.mesh.position.x,
          y: tube.mesh.position.y,
          z: tube.mesh.position.z,
        },
        rotation: {
          x: tube.mesh.rotation.x,
          y: tube.mesh.rotation.y,
          z: tube.mesh.rotation.z,
        },
      })),
    };

    return sceneData;
  }

  static downloadJSON(tubeManager) {
    const sceneData = this.exportToJSON(tubeManager);
    const dataStr = JSON.stringify(sceneData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `tube-assembly-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static exportToOBJ(tubeManager) {
    let objContent = '# Tube Joint Assembly\n';
    objContent += `# Generated: ${new Date().toISOString()}\n\n`;

    let vertexIndex = 1;
    const tubes = tubeManager.getTubes();

    tubes.forEach((tube, tubeIdx) => {
      const { width, height, length } = tube.config;
      const pos = tube.mesh.position;

      // Simple cube representation
      const w = width / 2;
      const h = height / 2;
      const l = length / 2;

      objContent += `# Tube ${tubeIdx + 1}\n`;
      objContent += `o Tube_${tubeIdx + 1}\n`;

      // Define vertices
      const vertices = [
        [-w, -h, -l],
        [w, -h, -l],
        [w, h, -l],
        [-w, h, -l],
        [-w, -h, l],
        [w, -h, l],
        [w, h, l],
        [-w, h, l],
      ];

      vertices.forEach((v) => {
        objContent += `v ${pos.x + v[0]} ${pos.y + v[1]} ${pos.z + v[2]}\n`;
      });

      // Define faces
      const faces = [
        [1, 2, 3, 4],
        [5, 8, 7, 6],
        [1, 5, 6, 2],
        [2, 6, 7, 3],
        [3, 7, 8, 4],
        [5, 1, 4, 8],
      ];

      faces.forEach((face) => {
        objContent += `f ${vertexIndex + face[0] - 1} ${vertexIndex + face[1] - 1} ${vertexIndex + face[2] - 1} ${vertexIndex + face[3] - 1}\n`;
      });

      vertexIndex += 8;
    });

    return objContent;
  }

  static downloadOBJ(tubeManager) {
    const objContent = this.exportToOBJ(tubeManager);
    const blob = new Blob([objContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `tube-assembly-${Date.now()}.obj`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static exportToCSV(tubeManager) {
    const tubes = tubeManager.getTubes();
    let csvContent = 'Type,Width,Height,Thickness,Length,PosX,PosY,PosZ,RotX,RotY,RotZ\n';

    tubes.forEach((tube) => {
      const row = [
        tube.config.type,
        tube.config.width,
        tube.config.height,
        tube.config.thickness,
        tube.config.length,
        tube.mesh.position.x.toFixed(2),
        tube.mesh.position.y.toFixed(2),
        tube.mesh.position.z.toFixed(2),
        tube.mesh.rotation.x.toFixed(4),
        tube.mesh.rotation.y.toFixed(4),
        tube.mesh.rotation.z.toFixed(4),
      ];
      csvContent += row.join(',') + '\n';
    });

    return csvContent;
  }

  static downloadCSV(tubeManager) {
    const csvContent = this.exportToCSV(tubeManager);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `tube-assembly-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
