import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AppNavbarPresenterView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    navigateToLogin: () => void;
    clearUserInfo: () => void;
}

export class AppNavbarPresenter {
    private view: AppNavbarPresenterView;
    private userService: UserService;

    public constructor(view: AppNavbarPresenterView) {
        this.view = view;
        this.userService = new UserService();
    }


    public async logout(authToken: AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0);

        try {
            await this.userService.logout(authToken);

            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
            this.view.navigateToLogin();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user out because of exception: ${error}`
            );
        }
    };
}
