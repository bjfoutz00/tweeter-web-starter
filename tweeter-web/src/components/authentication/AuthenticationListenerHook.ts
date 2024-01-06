import { useNavigate } from "react-router-dom"
import useUserInfo from "../userInfo/UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { AuthenticationView } from "../../presenter/AuthenticationPresenter";
import { AuthToken, User } from "tweeter-shared";

const useAuthenticationListener = (
    rememberMeRef: React.MutableRefObject<boolean>
): AuthenticationView => {
    const navigate = useNavigate();
    const { updateUserInfo } = useUserInfo();
    const { displayErrorMessage } = useToastListener();
    return {
        displayErrorMessage: displayErrorMessage,
        authenticated: (user: User, authToken: AuthToken) =>
            updateUserInfo(user, user, authToken, rememberMeRef.current),
        navigateTo: (url: string) => navigate(url),
    }
}

export default useAuthenticationListener;