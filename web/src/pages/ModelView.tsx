import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ModelPanel from '../components/ModelPanel';
import { fetchModel, fetchModelFile, type ModelDto } from '../services/models';

const Viewer = lazy(() => import('../components/Viewer'));

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; model: ModelDto; file: File };

// Keyed by id so switching models starts from a fresh state.
export default function ModelViewRoute() {
  const { id = '' } = useParams();
  return <ModelView key={id} id={id} />;
}

function ModelView({ id }: { id: string }) {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [viewError, setViewError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const model = await fetchModel(id);
        const file = await fetchModelFile(model);
        if (!cancelled) setState({ kind: 'ready', model, file });
      } catch (err) {
        if (!cancelled) {
          setState({ kind: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleLoaded = useCallback(() => setViewError(null), []);
  const handleError = useCallback((message: string) => setViewError(message), []);

  return (
    <div className="flex-1 flex flex-col gap-3">
      <Link to="/models" className="self-start text-sm text-light hover:text-secondary">
        ← Back to models
      </Link>
      <div className="relative flex-1 min-h-64 rounded-xl border-2 border-white/10 overflow-hidden">
        {state.kind === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center text-light">
            Loading model…
          </div>
        )}
        {state.kind === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center text-red-400">
            Could not open model: {state.message}
          </div>
        )}
        {state.kind === 'ready' && (
          <>
            <Suspense>
              <Viewer file={state.file} onLoaded={handleLoaded} onError={handleError} />
            </Suspense>
            <ModelPanel
              name={state.model.name}
              size={state.model.fileSize}
              errors={viewError ? [`Could not display: ${viewError}`] : []}
            />
          </>
        )}
      </div>
    </div>
  );
}
