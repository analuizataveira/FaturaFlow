import { Outlet } from 'react-router-dom';
import Modals from './components/internal/modals/modals';
import { Toaster } from './components/ui/toaster';
import { DrawerProvider } from './components';

function App() {
  return (
    <main>
      <Outlet />
      <Modals />
      <DrawerProvider />
      <Toaster />
    </main>
  );
}

export default App;
