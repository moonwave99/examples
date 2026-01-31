import { useState } from "react";

type UseSelectProps = {
  initialSelection: number[];
};

type UseSelectReturn = {
  selection: number[];
  set: (indexes: number[]) => void;
  add: (index: number) => void;
  remove: (index: number) => void;
  toggle: (index: number) => void;
};

export default function useSelect({
  initialSelection = []
}: UseSelectProps): UseSelectReturn {
  const [selection, setSelection] = useState(initialSelection);

  function add(index: number): void {
    if (selection.includes(index)) {
      return;
    }
    setSelection([...selection, index].sort());
  }

  function remove(index: number): void {
    setSelection(selection.filter((x) => x !== index));
  }

  function set(indexes: number[]): void {
    setSelection(indexes);
  }

  function toggle(index: number): void {
    if (selection.includes(index)) {
      remove(index);
      return;
    }
    add(index);
  }

  return { selection, set, add, remove, toggle };
}
