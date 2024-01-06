import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
    clearPost: () => void;
}

export class PostStatusPresenter extends Presenter {
    private statusService: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this.statusService = new StatusService();
    }

    public get view() {
        return super.view as PostStatusView;
    }

    public async postStatus(
        authToken: AuthToken,
        currentUser: User,
        post: string,
    ) {
        this.doOperationWithFailReport(
            async () => {
                this.view.displayInfoMessage("Posting status...", 0);
                
                let status = new Status(post, currentUser, Date.now());
                await this.statusService.postStatus(authToken, status);
                
                this.view.clearLastInfoMessage();
                this.view.clearPost();
                this.view.displayInfoMessage("Status posted!", 2000);
            },
            "post status"
        )
    }
}