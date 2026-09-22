import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Models from './pages/Models';
import ModelView from './pages/ModelView';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="models" element={<Models />} />
        <Route path="models/:id" element={<ModelView />} />
        <Route path="*" element={<div className="p-6">404 Not found</div>} />
      </Route>
    </Routes>
  );
}
