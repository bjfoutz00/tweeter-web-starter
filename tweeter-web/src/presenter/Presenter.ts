export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export abstract class Presenter {
    private _view: View;

    public constructor(view: View) {
        this._view = view;
    }
    public get view() {
        return this._view;
    }

    protected async doOperationWithFailReport(
        operation: () => Promise<void>,
        description: string
    ): Promise<void> {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${description} because of exception: ${error}`
            );
        }
    }
}