export type UploadStatus =
  | { kind: 'pending' }
  | { kind: 'success'; id: string }
  | { kind: 'error'; message: string };

export type ViewStatus =
  | { kind: 'loading'; progress: number }
  | { kind: 'ready' }
  | { kind: 'error'; message: string };

type Props = {
  file: File;
  upload: UploadStatus;
  view: ViewStatus;
};

export default function StatusPanel({ file, upload, view }: Props) {
  return (
    <div className="absolute top-3 left-3 max-w-[calc(100%-12rem)] rounded-lg bg-black/60 px-4 py-3 text-sm backdrop-blur space-y-1 pointer-events-none">
      <div className="font-semibold text-secondary truncate">{file.name}</div>
      <div className="text-light">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
      {/* Only failures are surfaced; success is implied by the model on screen. */}
      {view.kind === 'error' && (
        <div className="text-red-400">Could not display: {view.message}</div>
      )}
      {upload.kind === 'error' && (
        <div className="text-red-400">Could not store: {upload.message}</div>
      )}
    </div>
  );
}
