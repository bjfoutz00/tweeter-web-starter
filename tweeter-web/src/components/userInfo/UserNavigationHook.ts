import { useState } from "react";
import useToaster from "../toaster/ToastHook";
import useUserInfo from "./UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";


const useUserNavigation = () => {
    const { displayErrorToast } = useToaster();
    const { setDisplayedUser, currentUser, authToken } = useUserInfo();

    const listener: UserNavigationView = {
        displayErrorMessage: (message: string) => displayErrorToast(message, 0),
        setDisplayedUser: setDisplayedUser,
    }

    const [presenter] = useState(new UserNavigationPresenter(listener));

    const navigateToUser = (event: React.MouseEvent): void => {
        event.preventDefault();
        presenter.navigateToUser(event.target.toString(), authToken!, currentUser!);
    };

    return navigateToUser;
}

export default useUserNavigation;
