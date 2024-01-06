import { AuthToken, User } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "../components/mainLayout/StatusItemScroller";
import { StatusService } from "../model/service/StatusService";

export class FeedPresenter extends StatusItemPresenter {
    private service: StatusService;

    public constructor(view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }
    
    public async loadMoreItems(authToken: AuthToken, user: User): Promise<void> {
        try {
            if (this.hasMoreItems) {
                let [newItems, hasMore] = await this.service.loadMoreFeedItems(
                    authToken,
                    user,
                    PAGE_SIZE,
                    this.lastItem
                );

                this.hasMoreItems = hasMore;
                this.lastItem = newItems[newItems.length - 1];
                this.view.addItems(newItems);
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to load feed because of exception: ${error}`
            );
        }
    }

}