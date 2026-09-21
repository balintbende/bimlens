import { useCallback, useState } from 'react';
import { storeModel } from '../services/models';
import Dropzone, { type UploadStatus } from './home/Dropzone';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>({ kind: 'idle' });

  const upload = useCallback(async (dropped: File) => {
    setFile(dropped);
    setStatus({ kind: 'pending' });
    try {
      const dto = await storeModel(dropped);
      setStatus({ kind: 'success', id: dto.id });
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <Dropzone file={file} status={status} onFile={upload} />
    </div>
  );
}
