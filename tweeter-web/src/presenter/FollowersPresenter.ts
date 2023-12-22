import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { FollowService } from "../model/service/FollowService";
import { PAGE_SIZE } from "../components/mainLayout/UserItemScroller";

export class FollowersPresenter extends UserItemPresenter {
    private service: FollowService;

    public constructor(view: UserItemView) {
        super(view);
        this.service = new FollowService();
    }

    public async loadMoreItems(authToken: AuthToken, user: User): Promise<void> {
        try {
            if (this.hasMoreItems) {
                let [newItems, hasMore] = await this.service.loadMoreFollowers(
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
                `Failed to load followers because of exception: ${error}`
            );
        }
    }

}