import { useState } from 'react';
import { storeModel } from '../../services/models';

type Props = {
  file: File | null;
};

type Status =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'success'; id: string }
  | { kind: 'error'; message: string };

export default function StoreButton({ file }: Props) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const disabled = !file || status.kind === 'pending';

  const handleClick = async () => {
    if (!file) return;
    setStatus({ kind: 'pending' });
    try {
      // Placeholder counts — replaced when IFC.js parsing lands.
      const dto = await storeModel({
        name: file.name,
        wallCount: 0,
        beamCount: 0,
        columnCount: 0,
        slabCount: 0,
        doorCount: 0,
        windowCount: 0,
      });
      setStatus({ kind: 'success', id: dto.id });
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="rounded-md bg-primary px-6 py-2 text-white font-medium shadow-sm hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {status.kind === 'pending' ? 'Storing…' : 'Store'}
      </button>
      {status.kind === 'success' && (
        <p className="text-sm text-green-700">Stored ✓ (id: {status.id})</p>
      )}
      {status.kind === 'error' && (
        <p className="text-sm text-red-700">{status.message}</p>
      )}
    </div>
  );
}
