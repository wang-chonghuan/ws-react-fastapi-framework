import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../../routes/config';
import HealthCheck from './HealthCheck';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex items-center justify-around h-[var(--bottombar-h)]">
      {routes.map((route) => (
        <button
          key={route.path}
          onClick={() => navigate(route.path)}
          className={`flex flex-col items-center p-2 ${
            currentPath === route.path 
              ? 'text-black font-bold scale-110' 
              : 'text-gray-400'
          }`}
        >
          <route.icon size={currentPath === route.path ? 28 : 24} />
          <span className="text-xs mt-1">{route.label}</span>
        </button>
      ))}
      <HealthCheck />
    </div>
  );
};

export default BottomBar;
