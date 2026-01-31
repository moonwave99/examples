import {
  FC,
  FormEvent,
  MouseEventHandler,
  MouseEvent,
  useEffect,
  useState,
} from "react";

import cx from "clsx";

import useFocus from "./hooks/useFocus";
import { Item } from "./ItemView";

type ModalViewProps = {
  item: Item;
  onClose: Function;
};

const MODAL_ID = "MODAL";

const ModalView: FC<ModalViewProps> = ({ item, onClose }) => {
  const { title } = item;
  const [visible, setVisible] = useState(false);

  function onKeyDown(event: KeyboardEvent): void {
    const { code } = event;
    if (code === "Escape") {
      onClose();
    }
  }

  const { requestFocus } = useFocus({
    componentId: MODAL_ID,
    onKeyDown,
  });

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    requestFocus(MODAL_ID);
  }, [requestFocus]);

  function onModalClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains("modal")) {
      onClose();
    }
  }

  function onSubmit(event: FormEvent): void {
    event.preventDefault();
    onClose();
  }

  const className = cx("modal", { visible });

  return (
    <div className={className} onClick={onModalClick}>
      <div className="modal-content">
        <button onClick={onClose as MouseEventHandler} className="modal-close">
          ×
        </button>
        <h2>Feedback for {title}</h2>
        <form onSubmit={onSubmit}>
          <textarea
            autoFocus
            required
            rows={7}
            placeholder="Tell us what you think about this item"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ModalView;
