import * as React from "react";

export abstract class FadeableElement<P extends IFadeableElementProps, S extends IFadeableElementState> extends React.Component<P, S> {
	protected fadeOutTime: number = 300;

	protected constructor(props: P) {
		super(props);
		this.toggleOnScreen = this.toggleOnScreen.bind(this);
		this.setOnScreen = this.setOnScreen.bind(this);
	}

	protected toggleOnScreen(): void {
		const state: S = Object.assign({}, this.state);
		state.onScreen = !state.onScreen;
		this.setState(state);
	}

	protected setOnScreen(): void {
		if (!this.props.active) {
			setTimeout(this.toggleOnScreen, this.fadeOutTime);
		} else if (!this.state.onScreen) {
			this.toggleOnScreen();
		}
	}
}

export interface IFadeableElementProps {
	active: boolean;
}

export interface IFadeableElementState {
	onScreen: boolean;
}