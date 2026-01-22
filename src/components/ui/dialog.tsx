import React, { useState } from "react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild }: { children?: React.ReactNode; asChild?: boolean }) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogTrigger must be used within Dialog");

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => context.setOpen(true),
    });
  }

  return (
    <button onClick={() => context.setOpen(true)}>
      {children}
    </button>
  );
}

export function DialogContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogContent must be used within Dialog");

  if (!context.open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => context.setOpen(false)}
      />
      <div className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 w-96 ${className || ""}`}>
        {children}
      </div>
    </>
  );
}

export function DialogHeader({ children }: { children?: React.ReactNode }) {
  return <div className="px-6 py-4 border-b">{children}</div>;
}

export function DialogTitle({ children }: { children?: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
}
