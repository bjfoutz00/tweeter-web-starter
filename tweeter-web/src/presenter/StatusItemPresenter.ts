import { Status } from "tweeter-shared";
import { PagedPresenter } from "./PagedPresenter";
import { StatusService } from "../model/service/StatusService";

export interface StatusItemView {
    addItems: (items: Status[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter extends PagedPresenter<Status, StatusService> {
    protected createService(): StatusService {
        return new StatusService();
    }
}
