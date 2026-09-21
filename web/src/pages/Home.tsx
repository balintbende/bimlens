import { lazy, Suspense, useCallback, useState } from 'react';
import { storeModel } from '../services/models';
import Dropzone from './home/Dropzone';
import StatusPanel, { type UploadStatus, type ViewStatus } from './home/StatusPanel';

// The 3D engine is several MB, so it's only fetched once the first file is dropped.
const Viewer = lazy(() => import('./home/Viewer'));

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<UploadStatus>({ kind: 'pending' });
  const [view, setView] = useState<ViewStatus>({ kind: 'loading', progress: 0 });

  // Storing and displaying run in parallel: the upload starts here, while the
  // Viewer picks up the new file and converts it in the browser.
  const handleFile = useCallback(async (dropped: File) => {
    setFile(dropped);
    setView({ kind: 'loading', progress: 0 });
    setUpload({ kind: 'pending' });
    try {
      const dto = await storeModel(dropped);
      setUpload({ kind: 'success', id: dto.id });
    } catch (err) {
      setUpload({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }, []);

  const handleProgress = useCallback(
    (progress: number) => setView({ kind: 'loading', progress }),
    [],
  );
  const handleLoaded = useCallback(() => setView({ kind: 'ready' }), []);
  const handleError = useCallback(
    (message: string) => setView({ kind: 'error', message }),
    [],
  );

  const busy = !!file && (upload.kind === 'pending' || view.kind === 'loading');

  return (
    <div className="flex-1 flex flex-col">
      <Dropzone onFile={handleFile} disabled={busy}>
        {file && (
          <>
            <Suspense>
              <Viewer
                file={file}
                onProgress={handleProgress}
                onLoaded={handleLoaded}
                onError={handleError}
              />
            </Suspense>
            <StatusPanel file={file} upload={upload} view={view} />
          </>
        )}
      </Dropzone>
    </div>
  );
}
