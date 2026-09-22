import { useCallback, type ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  onFile: (file: File) => void;
  disabled: boolean;
  // Content shown once a file is loaded (the viewer); the whole area stays a drop target.
  children?: ReactNode;
};

export default function Dropzone({ onFile, disabled, children }: Props) {
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      onFile(acceptedFiles[0]);
    },
    [onFile],
  );

  const hasContent = !!children;
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDropAccepted,
    accept: { 'application/x-step': ['.ifc'] },
    multiple: false,
    disabled,
    // With a model shown, clicks belong to the 3D navigation, not the file dialog.
    noClick: hasContent,
    noKeyboard: hasContent,
  });

  const className = `relative w-full flex-1 min-h-64 border-2 rounded-xl overflow-hidden transition-colors ${
    hasContent
      ? 'border-white/10'
      : `border-dashed flex flex-col items-center justify-center gap-2 ${
          disabled ? 'cursor-wait' : 'cursor-pointer'
        }`
  } ${
    isDragActive
      ? 'border-white bg-white/5'
      : hasContent
        ? ''
        : 'border-white/20 hover:border-white/50'
  }`;

  return (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      {hasContent ? (
        <>
          {children}
          <button
            type="button"
            onClick={open}
            disabled={disabled}
            className="absolute top-3 right-3 rounded-md bg-white/10 px-3 py-1.5 text-sm text-secondary backdrop-blur hover:bg-white/20 disabled:opacity-40 disabled:cursor-wait"
          >
            Upload another file
          </button>
          {isDragActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-lg font-medium text-secondary">
              Drop to replace the model
            </div>
          )}
        </>
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
