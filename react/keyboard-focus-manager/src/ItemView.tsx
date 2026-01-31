import { FC, memo, MouseEvent } from "react";
import cx from "clsx";

export type Item = {
  id: number;
  title: string;
};

type ItemProps = {
  item: Item;
  index: number;
  selected?: boolean;
  onClick: (event: MouseEvent, index: number) => void;
  onDoubleClick: (item: Item) => void;
};

const ItemView: FC<ItemProps> = ({
  item,
  index,
  selected,
  onClick,
  onDoubleClick,
}) => {
  const { title } = item;
  const className = cx("item", { selected });
  return (
    <article
      className={className}
      onDoubleClick={() => onDoubleClick(item)}
      onClick={(event: MouseEvent) => onClick(event, index)}
    >
      {title}
    </article>
  );
};

export default memo(ItemView);
