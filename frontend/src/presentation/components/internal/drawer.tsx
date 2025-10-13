import { useDrawerStore } from '@/data/stores/drawer.store';
import { BaseDrawer, DrawerContent } from '../ui/drawer';

interface DrawerProps {
  id: string;
  isOpen: boolean;
  children: React.ReactNode;
  contentClassName?: string;
  onClose?: () => void;
}

const DrawerProvider = () => {
  const { drawers, closeDrawer } = useDrawerStore();

  return (
    <>
      {drawers.map(drawer => (
        <BaseDrawer
          key={`drawer-${drawer.id}`}
          open={drawer.isOpen}
          onOpenChange={() => closeDrawer(drawer.id)}
          direction='right'
          dismissible={false}
        >
          <DrawerContent
            onOverlayClick={() => closeDrawer(drawer.id)}
            className={drawer.contentClassName}
          >
            {drawer.children}
          </DrawerContent>
        </BaseDrawer>
      ))}
    </>
  );
};

export { DrawerProvider, type DrawerProps };
