import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarPresenterView extends MessageView {
    clearUserInfo: () => void;
    navigateToLogin: () => void;
}

export class AppNavbarPresenter extends Presenter {
    private userService: UserService;

    public constructor(view: AppNavbarPresenterView) {
        super(view);
        this.userService = new UserService();
    }

    public get view() {
        return super.view as AppNavbarPresenterView;
    }

    public async logout(authToken: AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0);

        this.doOperationWithFailReport(
            async () => {
                await this.userService.logout(authToken);
                this.view.clearLastInfoMessage();
                this.view.clearUserInfo();
                this.view.navigateToLogin();
            },
            "log user out"
        );
    }
}
