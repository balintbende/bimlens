import * as OBC from '@thatopen/components';
import workerUrl from '@thatopen/fragments/worker?url';
import * as THREE from 'three';

type World = OBC.SimpleWorld<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>;

/**
 * Thin wrapper around That Open Engine: a scene with one IFC model at a time.
 * IFC files are converted to Fragments in the browser (web-ifc WASM), then rendered.
 */
export class BimViewer {
  private readonly components = new OBC.Components();
  private readonly world: World;
  private readonly fragments: OBC.FragmentsManager;
  private readonly ifcLoader: OBC.IfcLoader;
  private readonly grid: OBC.SimpleGrid;
  private readonly ready: Promise<void>;
  private loadCount = 0;

  constructor(container: HTMLElement) {
    const world = this.components.get(OBC.Worlds).create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBC.SimpleRenderer
    >();
    world.scene = new OBC.SimpleScene(this.components);
    world.scene.setup();
    world.scene.three.background = new THREE.Color(0x000000);
    world.renderer = new OBC.SimpleRenderer(this.components, container);
    world.renderer.showLogo = false;
    world.camera = new OBC.OrthoPerspectiveCamera(this.components);
    this.world = world;

    this.components.init();
    this.grid = this.components.get(OBC.Grids).create(world);

    // Worker and WASM are served by the app itself (see vite.config.ts), not a CDN.
    this.fragments = this.components.get(OBC.FragmentsManager);
    this.fragments.init(workerUrl);
    world.camera.controls.addEventListener('update', () =>
      this.fragments.core.update(),
    );
    this.fragments.list.onItemSet.add(({ value: model }) => {
      model.useCamera(world.camera.three);
      world.scene.three.add(model.object);
      this.fragments.core.update(true);
    });
    // Avoid z-fighting between coplanar faces.
    this.fragments.core.models.materials.list.onItemSet.add(
      ({ value: material }) => {
        if (!('isLodMaterial' in material && material.isLodMaterial)) {
          material.polygonOffset = true;
          material.polygonOffsetUnits = 1;
          material.polygonOffsetFactor = Math.random();
        }
      },
    );

    this.ifcLoader = this.components.get(OBC.IfcLoader);
    this.ready = this.ifcLoader.setup({
      autoSetWasm: false,
      wasm: { path: `${import.meta.env.BASE_URL}wasm/`, absolute: true },
    });
  }

  /** Replaces the current model with the given IFC file and frames it. */
  async loadIfc(
    bytes: Uint8Array,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    await this.ready;
    for (const modelId of [...this.fragments.list.keys()]) {
      await this.fragments.core.disposeModel(modelId);
    }

    const model = await this.ifcLoader.load(bytes, true, `model-${++this.loadCount}`, {
      processData: { progressCallback: (progress) => onProgress?.(progress) },
    });
    // Sit the grid just under the model so it doesn't show through floor slabs.
    this.grid.three.position.y = model.box.min.y - 0.01;
    await this.world.camera.fitToItems();
  }

  dispose(): void {
    this.components.dispose();
  }
}
