import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
    setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter {
    private userService;

    constructor(view: UserNavigationView) {
        super(view);
        this.userService = new UserService();
    }

    public get view() {
        return super.view as UserNavigationView;
    }

    public async navigateToUser(
        stringWithUserAlias: string,
        authToken: AuthToken,
        loggedInUser: User
    ): Promise<void> {
        this.doOperationWithFailReport(
            async () => {
                let alias = this.extractAlias(stringWithUserAlias);
                
                let user = await this.userService.getUser(authToken!, alias);
                
                if (!!user) {
                    if (loggedInUser!.equals(user)) {
                        this.view.setDisplayedUser(loggedInUser!);
                    } else {
                        this.view.setDisplayedUser(user);
                    }
                }
            },
            "get user"
        );
    };

    private extractAlias(value: string): string {
        let index = value.indexOf("@");
        return value.substring(index);
    };
}