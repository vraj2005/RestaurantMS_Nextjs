import React, { useState } from "react";

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface DrawerContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined);

export function Drawer({ open: controlledOpen, onOpenChange, children }: DrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  const context = React.useContext(DrawerContext);
  if (!context) throw new Error("DrawerContent must be used within Drawer");

  if (!context.open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => context.setOpen(false)}
      />
      <div className={`fixed right-0 top-0 bottom-0 w-96 bg-white shadow-lg z-50 overflow-y-auto ${className || ""}`}>
        {children}
      </div>
    </>
  );
}

export function DrawerHeader({ children }: { children?: React.ReactNode }) {
  return <div className="px-6 py-4 border-b sticky top-0 bg-white">{children}</div>;
}

export function DrawerTitle({ children }: { children?: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
}
