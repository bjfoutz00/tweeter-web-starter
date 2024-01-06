import { UserService } from "../model/service/UserService";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
    private userService: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this.userService = new UserService();
    }

    public async login(
        alias: string,
        password: string,
        originalUrl: string | undefined
    ): Promise<void> {
        this.doAuthenticationOperation(
            () => this.userService.login(alias, password),
            () => {
                if (!!originalUrl) {
                    this.view.navigateTo(originalUrl);
                } else {
                    this.view.navigateTo("/");
                }
            },
            "log user in"
        )
    }
}