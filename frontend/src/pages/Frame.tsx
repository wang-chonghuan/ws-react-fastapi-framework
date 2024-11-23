import { Outlet } from 'react-router-dom';
import TopBar from '../components/frame/TopBar';
import BottomBar from '../components/frame/BottomBar';

const Frame = () => {
  return (
    <div className="bg-gray-200">
      <div className="relative mx-auto min-w-[var(--frame-min-w)] max-w-[var(--frame-max-w)]">
        <div className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-10 h-[var(--topbar-h)]">
          <TopBar />
        </div>
        <Outlet />
        <div className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10 h-[var(--bottombar-h)]">
          <BottomBar />
        </div>
      </div>
    </div>
  );
};

export default Frame;