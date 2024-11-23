import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Frame from './pages/Frame';
import { routes } from './routes/config';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Frame />}>
          <Route index element={<Navigate to="/news" replace />} />
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path.replace('/', '')} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;