import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    clearPost: () => void;
}

export class PostStatusPresenter {
    private view: PostStatusView;
    private statusService: StatusService;

    public constructor(view: PostStatusView) {
        this.view = view;
        this.statusService = new StatusService();
    }

    public async postStatus(
        authToken: AuthToken,
        currentUser: User,
        post: string,
    ) {
        try {
            this.view.displayInfoMessage("Posting status...", 0);

            let status = new Status(post, currentUser, Date.now());
            await this.statusService.postStatus(authToken, status);

            this.view.clearLastInfoMessage();
            this.view.clearPost();
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        }
    }
}