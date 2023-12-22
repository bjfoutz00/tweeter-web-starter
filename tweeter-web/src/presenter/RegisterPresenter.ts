import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { UserService } from "../model/service/UserService";


export interface RegisterView {
    displayErrorMessage: (message: string) => void;
    authenticated: (user: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter {
    private view: RegisterView;
    private userService: UserService;

    public constructor(view: RegisterView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array
    ): Promise<void> {
        try {
            let [user, authToken] = await this.userService.register(
                firstName,
                lastName,
                alias,
                password,
                userImageBytes
            );

            this.view.authenticated(user, authToken);
            this.view.navigateTo("/");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        }
    };

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    };
}
