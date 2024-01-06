import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
    setIsFollower: (value: boolean) => void;
    setFolloweesCount: (value: number) => void;
    setFollowersCount: (value: number) => void;
}

export class UserInfoPresenter extends Presenter {
    private followService: FollowService;

    public constructor(view: UserInfoView) {
        super(view);
        this.followService = new FollowService();
    }

    public get view() {
        return super.view as UserInfoView;
    }

    public async isFollower(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        this.doOperationWithFailReport(
            async () => {
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
            },
            "determine if follower"
        );
    }

    public async getFolloweesCount(
        authToken: AuthToken,
        follower: User
    ) {
        this.doOperationWithFailReport(
            async () => {
                this.view.setFolloweesCount(
                    await this.followService.getFolloweesCount(authToken, follower));
            },
            "get followees count"
        ); 
    }

    public async getFollowersCount(
        authToken: AuthToken,
        displayedUser: User
    ) {
        this.doOperationWithFailReport(
            async () => {
                this.view.setFollowersCount(
                    await this.followService.getFollowersCount(authToken, displayedUser)
                );
            },
            "get followers count"
        );
    }

    public async follow(authToken: AuthToken, userToFollow: User): Promise<void> {
        this.doOperationWithFailReport(
            async () => {
                this.view.displayInfoMessage(`Adding ${userToFollow.name} to followers...`, 0);
                
                let [followersCount, followeesCount] = await this.followService.follow(
                    authToken,
                    userToFollow
                );
                
                this.view.clearLastInfoMessage();
                this.view.setIsFollower(true);
                this.view.setFollowersCount(followersCount);
                this.view.setFolloweesCount(followeesCount);
            },
            "follow user"
        );
    }

    public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<void> {
        this.doOperationWithFailReport(
            async () => {
                this.view.displayInfoMessage(`Removing ${userToUnfollow.name} from followers...`, 0);
                
                let [followersCount, followeesCount] = await this.followService.unfollow(
                    authToken,
                    userToUnfollow
                );
                
                this.view.clearLastInfoMessage();
                this.view.setIsFollower(false);
                this.view.setFollowersCount(followersCount);
                this.view.setFolloweesCount(followeesCount);
        },
            "unfollow user"
        );
    }
}