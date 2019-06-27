import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../FadeableElement";
import {ArgKind, Pages} from "../Enums";

export abstract class Page<P extends IPageProps, S extends IPageState> extends FadeableElement<P, S> {
	protected readonly fadeOutTime: number = 900;

	protected constructor(props: P) {
		super(props);
		this.handleNext = this.handleNext.bind(this);
		// this.handleKey = this.handleKey.bind(this);
	}

	// public componentDidMount(): void {
	// 	document.addEventListener('keydown', this.handleKey);
	// }
	//
	// public componentWillUnmount(): void {
	// 	document.removeEventListener('keydown', this.handleKey);
	// }

	protected abstract handleNext(): void;

	protected chooseAnimation(suffix?: string): string {
		let ret: string;
		if (this.props.active) {
			ret = this.props.forward ? "RtoC" : "LtoC";
		} else {
			ret = this.props.forward ? "CtoL" : "CtoR";
		}
		return suffix ? ret + suffix : ret;
	}

	// protected handleKey(event: KeyboardEvent): void {
	// 	const key: string = event.code;
	// 	if ((key === "Enter" || event.code === 'ArrowRight') && this.props.active) {
	// 		setImmediate(this.handleNext)
	// 	}
	// }
}

export interface IPageProps extends IFadeableElementProps {
	proceedToPage: (page: Pages) => void;
	forward: boolean;
	updateSelected: (arg: any, kind: ArgKind) => void;
}

export interface IPageState extends IFadeableElementState {

}
