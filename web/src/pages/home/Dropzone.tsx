import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  file: File | null;
  onFile: (file: File | null) => void;
};

export default function Dropzone({ file, onFile }: Props) {
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      onFile(acceptedFiles[0]);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    accept: { 'application/x-step': ['.ifc'] },
    multiple: false,
  });

  const className = `w-full flex-1 min-h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
    isDragActive
      ? 'border-white bg-white/5'
      : 'border-white/20 hover:border-white/50'
  }`;

  return (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      {file ? (
        <div className="text-center">
          <div className="text-lg font-semibold text-secondary">
            {file.name}
          </div>
          <div className="text-sm text-light">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
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
