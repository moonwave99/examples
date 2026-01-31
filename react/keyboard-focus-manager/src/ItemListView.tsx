import { FC, MouseEvent, useEffect, useRef, MutableRefObject } from "react";
import cx from "clsx";
import { throttle, range } from "lodash";
import useFocus from "./hooks/useFocus";
import useSelect from "./hooks/useSelect";

import ItemView, { Item } from "./ItemView";

const ITEM_MARGIN = 8;

type ItemListViewProps = {
  items: Item[];
  componentId: string;
  onItemDoubleClick: (componentId: string, item: Item) => void;
  onEnter: (componentId: string, items: Item[]) => void;
  focusNext: Function;
  focusPrev: Function;
};

const scrollIntoView = throttle(
  (container: HTMLElement, selection: number[], direction: number) => {
    const target =
      container.querySelectorAll("li")[selection[selection.length - 1]];
    const { offsetHeight: targetOffsetHeight, offsetTop: targetOffsetTop } =
      target;

    const {
      scrollTop: parentScrollTop,
      offsetHeight: parentOffsetHeight,
      offsetTop: parentOffsetTop,
    } = container;

    let top = -1;

    if (direction === 1) {
      if (
        targetOffsetTop + targetOffsetHeight >
        parentOffsetHeight + parentScrollTop
      ) {
        top =
          targetOffsetTop +
          targetOffsetHeight -
          parentOffsetHeight +
          ITEM_MARGIN -
          parentOffsetTop;
      }
    } else if (parentScrollTop + parentOffsetTop > targetOffsetTop) {
      top = targetOffsetTop - parentOffsetTop - ITEM_MARGIN;
    }

    if (top < 0) {
      return;
    }

    container.scroll({ top, behavior: "smooth" });
  },
  50,
);

const ItemListView: FC<ItemListViewProps> = ({
  items,
  componentId,
  onItemDoubleClick,
  onEnter,
  focusNext,
  focusPrev,
}) => {
  const listRef = useRef<HTMLUListElement>(
    null,
  ) as MutableRefObject<HTMLUListElement>;
  const direction = useRef(0);
  const { selection, toggle, add, set } = useSelect({ initialSelection: [0] });

  useEffect(() => {
    scrollIntoView(listRef.current, selection, direction.current);
  }, [selection]);

  function onKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    const { code, metaKey, shiftKey } = event;
    const lowerBound = Math.max(selection[0] - 1, 0);
    const upperBound = Math.min(
      selection[selection.length - 1] + 1,
      items.length - 1,
    );
    switch (code) {
      case "KeyA":
        if (metaKey) {
          set(items.map((_, index) => index));
        }
        break;
      case "Enter":
        onEnter(
          componentId,
          selection.map((index) => items[index]),
        );
        break;
      case "ArrowUp":
        if (shiftKey && metaKey) {
          set(
            items
              .filter((_, index) => index < upperBound)
              .map((_, index) => index),
          );
        } else if (shiftKey) {
          add(lowerBound);
        } else if (metaKey) {
          set([0]);
        } else {
          set([lowerBound]);
        }
        direction.current = -1;
        break;
      case "ArrowDown":
        if (shiftKey && metaKey) {
          set(
            items
              .map((_, index) => (index > lowerBound ? index : -1))
              .filter((x) => x > -1),
          );
        } else if (shiftKey) {
          add(upperBound);
        } else if (metaKey) {
          set([items.length - 1]);
        } else {
          set([upperBound]);
        }
        direction.current = 1;
        break;
      case "ArrowRight":
        focusNext(componentId);
        break;
      case "ArrowLeft":
        focusPrev(componentId);
        break;
    }
  }

  const { requestFocus, hasFocus } = useFocus({
    componentId,
    onKeyDown,
  });

  function onClick(event: MouseEvent): void {
    requestFocus(componentId);
  }

  function onItemClick(event: MouseEvent, index: number): void {
    const { metaKey, shiftKey } = event;
    if (shiftKey) {
      const lowerBound = selection[0];
      const upperBound = selection[selection.length - 1];
      if (index < lowerBound) {
        set(range(index, upperBound + 1));
      } else if (index > upperBound) {
        set(range(lowerBound, index + 1));
      }
    } else if (metaKey) {
      toggle(index);
    } else {
      set([index]);
    }
  }

  const className = cx("item-list", { focused: hasFocus });

  function onDoubleClick(item: Item): void {
    onItemDoubleClick(componentId, item);
  }

  return (
    <ul className={className} onClick={onClick} ref={listRef}>
      {items.map((item, index) => (
        <li key={item.id}>
          <ItemView
            selected={selection.includes(index)}
            item={item}
            index={index}
            onClick={onItemClick}
            onDoubleClick={onDoubleClick}
          />
        </li>
      ))}
    </ul>
  );
};

export default ItemListView;
