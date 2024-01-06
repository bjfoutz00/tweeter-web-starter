import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
    setIsFollower: (value: boolean) => void;
    setFolloweesCount: (value: number) => void;
    setFollowersCount: (value: number) => void;
}

export class UserInfoPresenter {
    private view: UserInfoView;
    private followService: FollowService;

    public constructor(view: UserInfoView) {
        this.view = view;
        this.followService = new FollowService();
    }

    public async isFollower(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.followService.getIsFollowerStatus(
                        authToken,
                        currentUser,
                        displayedUser
                    )
                );
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
            );
        }
    };

    public async getFolloweesCount(
        authToken: AuthToken,
        follower: User
    ) {
        try {
            this.view.setFolloweesCount(
                await this.followService.getFolloweesCount(authToken, follower));
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`
            );
        }
    };

    public async getFollowersCount(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this.view.setFollowersCount(
                await this.followService.getFollowersCount(authToken, displayedUser)
            );
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    };

    public async follow(authToken: AuthToken, userToFollow: User): Promise<void> {
        try {
            this.view.displayInfoMessage(`Adding ${userToFollow.name} to followers...`, 0);

            let [followersCount, followeesCount] = await this.followService.follow(
                authToken,
                userToFollow
            );

            this.view.clearLastInfoMessage();
            this.view.setIsFollower(true);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        }
    }

    public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<void> {
        try {
            this.view.displayInfoMessage(`Removing ${userToUnfollow.name} from followers...`, 0);

            let [followersCount, followeesCount] = await this.followService.unfollow(
                authToken,
                userToUnfollow
            );

            this.view.clearLastInfoMessage();
            this.view.setIsFollower(false);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to unfollow user because of exception: ${error}`
            );
        }
    }
}