import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export type UploadStatus =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'success'; id: string }
  | { kind: 'error'; message: string };

type Props = {
  file: File | null;
  status: UploadStatus;
  onFile: (file: File) => void;
};

export default function Dropzone({ file, status, onFile }: Props) {
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      onFile(acceptedFiles[0]);
    },
    [onFile],
  );

  const uploading = status.kind === 'pending';
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    accept: { 'application/x-step': ['.ifc'] },
    multiple: false,
    disabled: uploading,
  });

  const className = `w-full flex-1 min-h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors ${
    uploading ? 'cursor-wait' : 'cursor-pointer'
  } ${
    isDragActive
      ? 'border-white bg-white/5'
      : 'border-white/20 hover:border-white/50'
  }`;

  return (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      {file ? (
        <div className="text-center space-y-1">
          <div className="text-lg font-semibold text-secondary">
            {file.name}
          </div>
          <div className="text-sm text-light">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
          {status.kind === 'pending' && (
            <p className="text-sm text-light">Uploading…</p>
          )}
          {status.kind === 'success' && (
            <p className="text-sm text-green-400">
              Stored ✓ (id: {status.id}) — drop another file to upload more
            </p>
          )}
          {status.kind === 'error' && (
            <p className="text-sm text-red-400">{status.message}</p>
          )}
        </div>
      ) : (
        <div className="text-center text-light">
          <div className="text-lg font-medium">
            Drop an IFC file here, or click to select
          </div>
          <div className="text-sm">.ifc files only</div>
        </div>
      )}
    </div>
  );
}
