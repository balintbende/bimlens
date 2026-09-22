import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchModels, type ModelDto } from '../services/models';
import { formatFileSize } from '../utils/format';

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; models: ModelDto[] };

export default function Models() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetchModels()
      .then((models) => !cancelled && setState({ kind: 'ready', models }))
      .catch(
        (err) =>
          !cancelled &&
          setState({ kind: 'error', message: err instanceof Error ? err.message : 'Unknown error' }),
      );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Models</h2>

      {state.kind === 'loading' && <p className="text-light">Loading…</p>}
      {state.kind === 'error' && (
        <p className="text-red-400">Could not load models: {state.message}</p>
      )}
      {state.kind === 'ready' && state.models.length === 0 && (
        <p className="text-light">
          No models yet.{' '}
          <Link to="/" className="text-secondary underline underline-offset-4">
            Upload one on the dashboard
          </Link>
          .
        </p>
      )}
      {state.kind === 'ready' && state.models.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="text-left text-light">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium text-right">File size</th>
                <th className="px-4 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {state.models.map((model) => (
                <tr key={model.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-secondary break-all">{model.name}</td>
                  <td className="px-4 py-3 text-right text-light whitespace-nowrap">
                    {formatFileSize(model.fileSize)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/models/${model.id}`}
                      className="inline-block whitespace-nowrap rounded-md bg-white/10 px-3 py-1.5 text-secondary hover:bg-white/20"
                    >
                      Open model
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
