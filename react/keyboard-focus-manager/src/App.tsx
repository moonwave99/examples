import { FC, useState, useEffect, useContext, useCallback } from "react";
import { FocusContext } from "./contexts/FocusContext";
import ItemListView from "./ItemListView";
import ModalView from "./ModalView";
import { Item } from "./ItemView";

import "./index.css";

function getItemsForColumn(id: string): Item[] {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    title: `Item ${id}${index + 1}`,
  }));
}

function nextId(id: string, ids: string[]): string {
  const index = ids.findIndex((x) => x === id);
  const nextIndex = index === ids.length - 1 ? 0 : index + 1;
  return ids[nextIndex];
}

function prevId(id: string, ids: string[]): string {
  const index = ids.findIndex((x) => x === id);
  const prevIndex = index === 0 ? ids.length - 1 : index - 1;
  return ids[prevIndex];
}

type AppProps = {
  ids: string[];
};

const App: FC<AppProps> = ({ ids }) => {
  const [currentItem, setCurrentItem] = useState<Item>(null as unknown as Item);
  const { requestFocus } = useContext(FocusContext);

  const focusNext = useCallback(
    (currentComponentId: string) => {
      requestFocus(nextId(currentComponentId, ids));
    },
    [requestFocus, ids],
  );

  const focusPrev = useCallback(
    (currentComponentId: string) => {
      requestFocus(prevId(currentComponentId, ids));
    },
    [requestFocus, ids],
  );

  const onEnter = useCallback((componentId: string, items: Item[]) => {
    alert(`[${componentId}]: ${items.map((x) => x.title).join(",")}`);
  }, []);

  useEffect(() => {
    requestFocus(ids[0]);
  }, [requestFocus, ids]);

  function onItemDoubleClick(componentId: string, item: Item): void {
    setCurrentItem(item);
  }

  function onClose(): void {
    setCurrentItem(null as unknown as Item);
    requestFocus(ids[0]);
  }

  return (
    <div className="app">
      <header>
        <h1>react-keyboard-focus-manager demo</h1>
        <p>
          Navigate the columns with arrows, select multiple entries with{" "}
          <kbd>cmd</kbd>/<kbd>shift</kbd>/click on the entry.
        </p>
        <p>
          Hit <kbd>Enter</kbd> to display current selection, double click on any
          entry to open a modal.
        </p>
      </header>
      <div className="columns">
        {ids.map((id) => (
          <ItemListView
            key={id}
            items={getItemsForColumn(id)}
            componentId={id}
            onEnter={onEnter}
            onItemDoubleClick={onItemDoubleClick}
            focusNext={focusNext}
            focusPrev={focusPrev}
          />
        ))}
      </div>
      {currentItem && <ModalView item={currentItem} onClose={onClose} />}
    </div>
  );
};

export default App;
