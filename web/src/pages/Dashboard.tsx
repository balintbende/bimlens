import { lazy, Suspense, useCallback, useState } from 'react';
import ModelPanel from '../components/ModelPanel';
import { storeModel } from '../services/models';
import Dropzone from './dashboard/Dropzone';

// The 3D engine is several MB, so it's only fetched once the first file is dropped.
const Viewer = lazy(() => import('../components/Viewer'));

type Status = { kind: 'pending' } | { kind: 'done' } | { kind: 'error'; message: string };

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Unknown error');

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<Status>({ kind: 'pending' });
  const [view, setView] = useState<Status>({ kind: 'pending' });

  // Storing and displaying run in parallel: the upload starts here, while the
  // Viewer picks up the new file and converts it in the browser.
  const handleFile = useCallback(async (dropped: File) => {
    setFile(dropped);
    setView({ kind: 'pending' });
    setUpload({ kind: 'pending' });
    try {
      await storeModel(dropped);
      setUpload({ kind: 'done' });
    } catch (err) {
      setUpload({ kind: 'error', message: errorMessage(err) });
    }
  }, []);

  const handleLoaded = useCallback(() => setView({ kind: 'done' }), []);
  const handleError = useCallback(
    (message: string) => setView({ kind: 'error', message }),
    [],
  );

  const busy = !!file && (upload.kind === 'pending' || view.kind === 'pending');
  const errors = [
    ...(view.kind === 'error' ? [`Could not display: ${view.message}`] : []),
    ...(upload.kind === 'error' ? [`Could not store: ${upload.message}`] : []),
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Dropzone onFile={handleFile} disabled={busy}>
        {file && (
          <>
            <Suspense>
              <Viewer file={file} onLoaded={handleLoaded} onError={handleError} />
            </Suspense>
            <ModelPanel name={file.name} size={file.size} errors={errors} />
          </>
        )}
      </Dropzone>
    </div>
  );
}
