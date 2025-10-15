import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from "@/utils/cn"

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-neutral-100 p-1 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      '',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const GenerateTabTrigger = ({
  value,
  label,
  activeTab,
  handleTabButton
}: {
  value: string;
  label: string;
  activeTab: string;
  handleTabButton: (tabValue: string) => void;
}) => {
  return (
    <TabsTrigger
      onClick={() => handleTabButton(value)}
      className={cn(
        'font-bold border-b-2 border-neutral-400 text-neutral-400 px-2',
        activeTab === value && 'text-primary-600 border-primary-600',
      )}
      value={value}
    >
      {label}
    </TabsTrigger>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger, GenerateTabTrigger };
