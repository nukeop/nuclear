import { createContext, useContext } from 'react';

export type SidebarCompactContextValue = {
  isCompact: boolean;
};

const SidebarCompactContext = createContext<SidebarCompactContextValue | null>(
  null,
);

export function useSidebarCompact(): boolean {
  const ctx = useContext(SidebarCompactContext);
  if (!ctx) {
    return false;
  }
  return ctx.isCompact;
}

export function SidebarCompactProvider({
  isCompact,
  children,
}: {
  isCompact: boolean;
  children: React.ReactNode;
}) {
  return (
    <SidebarCompactContext.Provider value={{ isCompact }}>
      {children}
    </SidebarCompactContext.Provider>
  );
}
