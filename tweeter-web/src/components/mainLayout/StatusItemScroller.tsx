import { Status } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import { StatusItemPresenter, StatusItemView } from "../../presenter/StatusItemPresenter";
import useUserInfo from "../userInfo/UserInfoHook";
import StatusItem from "../statusItem/StatusItem";

interface Props {
  presenterGenerator: (view: StatusItemView) => StatusItemPresenter;
}

const StatusItemsScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);

  // Required to allow the addItems method to see the current value of 'items'
  // instead of the value from when the closure was created.
  const itemsReference = useRef(items);
  itemsReference.current = items;

  const listener: StatusItemView = {
    displayErrorMessage: displayErrorMessage,
    addItems: (newItems: Status[]) =>
      setItems([...itemsReference.current, ...newItems])
  }

  const [presenter] = useState(props.presenterGenerator(listener));

  const { displayedUser, authToken } = useUserInfo();

  // Load initial items
  useEffect(() => {
    loadMoreItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMoreItems = () => {
    presenter.loadMoreItems(authToken!, displayedUser!);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem value={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemsScroller;
