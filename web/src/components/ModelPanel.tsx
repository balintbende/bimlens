import { formatFileSize } from '../utils/format';

type Props = {
  name: string;
  size: number;
  // Only failures are surfaced; success is implied by the model on screen.
  errors?: string[];
};

export default function ModelPanel({ name, size, errors = [] }: Props) {
  return (
    <div className="absolute top-3 left-3 max-w-[calc(100%-12rem)] rounded-lg bg-black/60 px-4 py-3 text-sm backdrop-blur space-y-1 pointer-events-none">
      <div className="font-semibold text-secondary truncate">{name}</div>
      <div className="text-light">{formatFileSize(size)}</div>
      {errors.map((error) => (
        <div key={error} className="text-red-400">
          {error}
        </div>
      ))}
    </div>
  );
}
