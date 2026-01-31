import { useContext, useEffect } from "react";
import { FocusContext, KeyboardHandler } from "../contexts/FocusContext";

type UseFocusProps = {
  componentId: string;
  onKeyDown: KeyboardHandler;
};

type UseFocusReturn = {
  requestFocus: Function;
  hasFocus: boolean;
};

export default function useFocus({
  componentId,
  onKeyDown
}: UseFocusProps): UseFocusReturn {
  const { subscribe, unsubscribe, requestFocus, hasFocus } = useContext(
    FocusContext
  );

  useEffect(() => {
    subscribe(onKeyDown, componentId);
    return () => {
      unsubscribe(componentId);
    };
  }, [componentId, subscribe, unsubscribe, onKeyDown]);

  return {
    requestFocus,
    hasFocus: hasFocus(componentId)
  };
}
