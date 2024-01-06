import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { UserService } from "../model/service/UserService";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";


export interface RegisterView extends AuthenticationView {
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends AuthenticationPresenter {
    private userService: UserService;

    public constructor(view: RegisterView) {
        super(view);
        this.userService = new UserService();
    }

    public get view() {
        return super.view as RegisterView;
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array
    ): Promise<void> {
        this.doAuthenticationOperation(
            () => this.userService.register(
                firstName,
                lastName,
                alias,
                password,
                userImageBytes
            ),
            () => this.view.navigateTo("/"),
            "register user"
        );
    }
            
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
