import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dialog, Button, Classes } from "@blueprintjs/core";

import { Undefinable } from "../../../shared/types";

export interface IAlertProps {
    /**
     * The title of the dialog.
     */
    title: string;
    /**
     * The message of the dialog.
     */
    message: string;
    /**
     * The icon to show on top-left of the dialog.
     */
    icon: Undefinable<JSX.Element>;
    /**
     * Defines the html div element that contains the alert.
     */
    container: HTMLDivElement;
    /**
     * Optional body element.
     */
    body?: Undefinable<JSX.Element>;
    /**
     * Called on the alert is closed.
     */
    onClose: () => void;
}

export class Alert extends React.Component<IAlertProps, { }> {
    /**
     * Shows the dialog with a title and a message.
     * @param title the title of the dialog.
     * @param message the message of the dialog.
     * @param icon the icon of the dialog to show on top-left.
     * @param body optional body to draw in the alert.
     */
    public static async Show(title: string, message: string, icon?: Undefinable<JSX.Element>, body?: Undefinable<JSX.Element>): Promise<void> {
        return new Promise<void>((resolve) => {
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.pointerEvents = "none";
            document.body.appendChild(container);

            const dialog = <Alert title={title} message={message} icon={icon} container={container} body={body} onClose={resolve}></Alert>;
            ReactDOM.render(dialog, container);
        });
    }

    /**
     * Constructor.
     * @param props the component's props.
     */
    public constructor(props: IAlertProps) {
        super(props);
        this.state = { };
    }

    /**
     * Renders the component.
     */
    public render(): React.ReactNode {
        return (
            <Dialog
                isOpen={true}
                usePortal={true}
                title={this.props.title}
                icon={this.props.icon}
                className={Classes.DARK}
                enforceFocus={true}
                onClose={() => this._handleClose()}
            >
                <div className={Classes.DIALOG_BODY}>
                    <p><strong>{this.props.message}</strong></p>
                    {this.props.body}
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={() => this._handleClose()}>Ok</Button>
                    </div>
                </div>
            </Dialog>
        );
    }

    /**
     * Called on the user clicks on the "Ok" button or closes the dialog.
     */
    private _handleClose(): void {
        ReactDOM.unmountComponentAtNode(this.props.container);
        this.props.container.remove();
        this.props.onClose && this.props.onClose();
    }
}
