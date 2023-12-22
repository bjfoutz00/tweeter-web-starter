import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    setDisplayedUser: (user: User) => void;
    displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
    private view: UserNavigationView;
    private userService;

    constructor(view: UserNavigationView) {
        this.view = view;
        this.userService = new UserService();
    }
    
    public async navigateToUser(
        stringWithUserAlias: string,
        authToken: AuthToken,
        loggedInUser: User
    ): Promise<void> {
        try {
            let alias = this.extractAlias(stringWithUserAlias);

            let user = await this.userService.getUser(authToken!, alias);

            if (!!user) {
                if (loggedInUser!.equals(user)) {
                    this.view.setDisplayedUser(loggedInUser!);
                } else {
                    this.view.setDisplayedUser(user);
                }
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    };

    private extractAlias(value: string): string {
        let index = value.indexOf("@");
        return value.substring(index);
    };
}