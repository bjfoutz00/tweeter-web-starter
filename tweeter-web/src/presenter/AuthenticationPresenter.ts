import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
    authenticated: (user: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
}

export abstract class AuthenticationPresenter extends Presenter {
    public get view() {
        return super.view as AuthenticationView;
    }

    protected doAuthenticationOperation(
        operation: () => Promise<[User, AuthToken]>,
        notificationFunction: () => void,
        description: string
    ) {
        this.doOperationWithFailReport(
            async () => {
                let [user, authToken] = await operation();
                this.view.authenticated(user, authToken);
                notificationFunction();
            },
            description
        );
    }
}