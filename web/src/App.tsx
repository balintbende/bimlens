import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<div className="p-6">404 Not found</div>} />
      </Route>
    </Routes>
  );
}
