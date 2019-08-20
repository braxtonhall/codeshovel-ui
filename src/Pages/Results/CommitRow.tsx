import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";

export abstract class ReactCommitRow<P extends ICommitRowProps, S extends IFadeableElementState> extends FadeableElement<P, S> {
	protected datec: string = "";
	protected authc: string = "";
	protected filec: string = "";
	protected comtc: string = "";
	protected detlc: string = "";
	protected typec: string = "";

	protected setUpColours(): void {
		let temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.datec = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.authc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.filec = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.comtc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.detlc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.typec = temp < 10 ? "0" + temp : "" + temp;
	}

	protected getFontSize(s: string, modifier: number = 1): string {
		return Math.min(
			(this.props.windowWidth * (1 / Math.max(s.length, 8)) * 0.01 * Constants.COMMIT_FONT_APPROX_SIZE * modifier),
			(Math.log(this.props.windowHeight) * Constants.COMMIT_ROW_HEIGHT / 2) * modifier
		) + "px";
	}
}

export interface ICommitRowProps extends IFadeableElementProps{
	windowWidth: number;
	windowHeight: number;
}