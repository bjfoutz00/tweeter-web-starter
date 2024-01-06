import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "../components/mainLayout/StatusItemScroller";

export class StoryPresenter extends StatusItemPresenter {
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
                `Failed to load story because of exception: ${error}`
            );
        }
    }
}