import { useEffect, useRef } from 'react';
import { BimViewer } from '../viewer/BimViewer';

type Props = {
  file: File;
  onProgress?: (progress: number) => void;
  onLoaded: () => void;
  onError: (message: string) => void;
};

export default function Viewer({ file, onProgress, onLoaded, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<BimViewer | null>(null);

  // Declared before the load effect so the viewer exists when that effect runs.
  useEffect(() => {
    const viewer = new BimViewer(containerRef.current!);
    viewerRef.current = viewer;
    return () => {
      viewerRef.current = null;
      viewer.dispose();
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    // Conversion can't be aborted, so results of a superseded load are ignored.
    let cancelled = false;

    (async () => {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        await viewer.loadIfc(bytes, (progress) => {
          if (!cancelled) onProgress?.(progress);
        });
        if (!cancelled) onLoaded();
      } catch (err) {
        if (!cancelled) {
          onError(err instanceof Error ? err.message : 'Could not display the model');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [file, onProgress, onLoaded, onError]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
