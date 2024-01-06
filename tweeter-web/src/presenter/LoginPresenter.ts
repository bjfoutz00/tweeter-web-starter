import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
    displayErrorMessage: (message: string) => void;
    authenticated: (user: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
}
export class LoginPresenter {
    private view: LoginView;
    private userService: UserService;
    
    public constructor(view: LoginView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async login(
        alias: string,
        password: string,
        originalUrl: string | undefined
    ): Promise<void> {
        try {
            let [user, authToken] = await this.userService.login(alias, password);

            this.view.authenticated(user, authToken);

            if (!!originalUrl) {
                this.view.navigateTo(originalUrl);
            } else {
                this.view.navigateTo("/");
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        }
    }
}