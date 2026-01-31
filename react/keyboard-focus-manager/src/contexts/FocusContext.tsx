import React, {
  ReactNode,
  useState,
  useEffect,
  createContext,
  useCallback
} from "react";

export type KeyboardHandler = (event: KeyboardEvent) => void;

export const FocusContext = createContext({
  hasFocus: (componentId: string): boolean => false,
  subscribe: (handler: KeyboardHandler, componentId: string) => {},
  unsubscribe: (componentId: string) => {},
  requestFocus: (componentId: string) => {}
});

const handlers: Record<string, KeyboardHandler> = {};

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const [focusedComponentId, setFocusedComponentId] = useState("");

  const subscribe = useCallback(
    (handler: KeyboardHandler, componentId: string) =>
      (handlers[componentId] = handler),
    []
  );
  const unsubscribe = useCallback(
    (componentId: string) => delete handlers[componentId],
    []
  );
  const requestFocus = useCallback(
    (componentId: string) => setFocusedComponentId(componentId),
    []
  );
  const hasFocus = useCallback(
    (componentId: string) => focusedComponentId === componentId,
    [focusedComponentId]
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      const handler = handlers[focusedComponentId];
      if (!handler) {
        return;
      }
      handler(event);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [focusedComponentId]);

  return (
    <FocusContext.Provider
      value={{
        subscribe,
        unsubscribe,
        requestFocus,
        hasFocus
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};
