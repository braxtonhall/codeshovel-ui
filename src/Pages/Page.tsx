import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../FadeableElement";
import {Pages} from "../Enums";

export abstract class Page<P extends IPageProps, S extends IPageState> extends FadeableElement<P, S> {
	protected readonly fadeOutTime: number = 900;
	protected abstract readonly page: Pages;

	protected constructor(props: P) {
		super(props);
		this.handleNext = this.handleNext.bind(this);
	}

	protected abstract handleNext(): void;

	protected chooseTransform(): string {
		if (this.props.page === this.page) {
			return "translate(-50%, -50%)";
		} else if (this.props.page > this.page) {
			return "translate(-200%, -50%)";
		} else {
			return "translate(200%, -50%)";
		}
	}
}

export interface IPageProps extends IFadeableElementProps {
	proceedToPage: (page: Pages) => void;
	page: Pages;
}

export interface IPageState extends IFadeableElementState {

}
