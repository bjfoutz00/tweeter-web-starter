import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedPresenterView<T> extends View {
    addItems: (items: T[]) => void;
}

export abstract class PagedPresenter<T, U> extends Presenter {
    private _service: U;
    private _hasMoreItems: boolean = true;
    private _lastItem: T | null = null;

    public constructor(view: PagedPresenterView<T>) {
        super(view);
        this._service = this.createService();
    }

    public get view() {
        return super.view as PagedPresenterView<T>;
    }

    public get service(): U {
        return this._service;
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }
    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    public get lastItem(): T | null {
        return this._lastItem;
    }
    protected set lastItem(value: T | null) {
        this._lastItem = value;
    }

    protected abstract createService(): U;

    public async loadMoreItems(authToken: AuthToken, user: User): Promise<void> {
        this.doOperationWithFailReport(
            async () => {
                if (this.hasMoreItems) {
                    let [newItems, hasMore] = await this.getMoreItems(authToken, user);
                    this.hasMoreItems = hasMore;
                    this.lastItem = newItems[newItems.length - 1];
                    this.view.addItems(newItems);                    
                }
            }, 
            `load ${this.getItemDescription()} items`
        );
    }

    protected abstract getMoreItems(
        authToken: AuthToken,
        user: User
    ): Promise<[T[], boolean]>;

    protected abstract getItemDescription(): string;
}