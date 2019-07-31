import {IMethodTransport} from "./Types";
import {Changes} from "./Enums";

export class Constants {
	public static readonly EXAMPLE_LINKS: string[] = [
		"https://username.com/apache/commons-lang",
		"https://username.com/apache/flink",
		// "https://github.com/apache/lucene-solr",
		"https://username.com/checkstyle/checkstyle",
		"https://username.com/eclipse/jetty.project",
		// "https://github.com/hibernate/hibernate-orm",
		// "https://github.com/hibernate/hibernate-search",
		"https://username.com/javaparser/javaparser",
		// "https://github.com/JetBrains/intellij-community",
		"https://username.com/kiegroup/drools",
		"https://username.com/mockito/mockito",
		// "https://github.com/spring-projects/spring-boot",
	];

	public static readonly DEFAULT_METHOD: IMethodTransport = {
		longName: "",
		startLine: -1,
		methodName: "",
		isAbstract: false,
		isStatic: false,
		visibility: ""
	};

	public static readonly CHANGE_TYPES: {[internalName: string]: string} = {
		[Changes.BODY_CHANGE]: "Body",
		[Changes.FILE_RENAME]: "File Rename",
		[Changes.INTRODUCED]: "Introduction",
		[Changes.EXCEPS_CHANGE]: "Exceptions",
		[Changes.MOD_CHANGE]: "Modifier",
		[Changes.MOV_FROM_FILE]: "Move From File",
		[Changes.MULTI_CHANGE]: "Multiple",
		[Changes.NO_CHANGE]: "None",
		[Changes.PARAM_CHANGE]: "Parameter",
		[Changes.PARAM_META_CHANGE]: "Parameter Meta",
		[Changes.RENAME]: "Rename",
		[Changes.RETURN_CHANGE]: "Return"
	};

	public static readonly CHANGE_IMAGES: {[internalName: string]: string} = {
		[Changes.BODY_CHANGE]: "url(/logos/body.png)",
		[Changes.FILE_RENAME]: "url(/logos/filerename.png)",
		[Changes.INTRODUCED]: "url(/logos/introduced.png)",
		[Changes.EXCEPS_CHANGE]: "url(/logos/exception.png)",
		[Changes.MOD_CHANGE]: "url(/logos/modifier.png)",
		[Changes.MOV_FROM_FILE]: "url(/logos/movefromfile.png)",
		[Changes.MULTI_CHANGE]: "url(/logos/nochange.png)",
		[Changes.NO_CHANGE]: "url(/logos/nochange.png)",
		[Changes.PARAM_CHANGE]: "url(/logos/parameter.png)",
		[Changes.PARAM_META_CHANGE]: "url(/logos/parameter.png)",
		[Changes.RENAME]: "url(/logos/rename.png)",
		[Changes.RETURN_CHANGE]: "url(/logos/return.png)",
	};

	public static readonly CHANGE_DESCRIPTIONS: {[internalName: string]: string} = {
		[Changes.BODY_CHANGE]: "Method Body Change",
		[Changes.FILE_RENAME]: "File Path Rename",
		[Changes.INTRODUCED]: "Method Introduction",
		[Changes.EXCEPS_CHANGE]: "Exceptions Change",
		[Changes.MOD_CHANGE]: "Access Modifier Change",
		[Changes.MOV_FROM_FILE]: "Method Moved to Another File",
		[Changes.MULTI_CHANGE]: "Multiple Changes",
		[Changes.NO_CHANGE]: "No Changes",
		[Changes.PARAM_CHANGE]: "Parameter Change",
		[Changes.PARAM_META_CHANGE]: "Parameter Modifier Change",
		[Changes.RENAME]: "Method Rename",
		[Changes.RETURN_CHANGE]: "Return Type Change",
	};

	public static readonly IN_TEST: boolean = false;
	public static readonly TEST: string = "r2";
	public static readonly MANIFEST_PATH: string = "/responses.json";

	public static readonly NOTIFICATION_DISPLAY_TIME: number = 3000;
	public static readonly SHOW_ABOUT_DELAY_TIME: number = 1000;

	public static readonly BACKGROUND_TEXT_OPACITY: number = 0.5;
	public static readonly BLUR_FACTOR: number = 1.2;

	public static readonly FONT: string = "100% \"Courier New\", Futura, sans-serif";

	public static readonly SERVER_ADDRESS: string = "http://localhost:1234";

	public static readonly INVALID_URL_ERROR_TEXT: string = "Please enter a link to proceed.";

	public static readonly SERVER_BUSY_ERROR_TEXT: string = "The server is under heavy load. Please try again in a moment!";
	public static readonly INTERNAL_ERROR_TEXT: string = "The server is having trouble processing this specific request. Please try another.";
	public static readonly CACHE_ERROR_TEXT: string = "Oddly we couldn't couldn't find this response in our cache.";

	public static readonly EXAMPLE_TEXT_SIZE: number = 6;
	public static readonly EXAMPLE_ROW_WIDTH: number = 10;

	public static readonly FILE_REQUEST_ERROR_TEXT: string = "There don't appear to be any .java files in this repo. Please try another.";
	public static readonly FILE_SHA_PLACEHOLDER_TEXT: string = "Specific commit? Enter the SHA here and reload";
	public static readonly FILE_SHA_ERROR_TEXT: string = "Enter a SHA to refresh";
	public static readonly FILE_SYSTEM_TEXT_SIZE: number = 10;

	public static readonly LIST_ELEMENT_NEW_LINE_PX_COUNT: number = 15;

	public static readonly METHODS_MAX_INDENT_UNIT_COUNT: number = 20;
	public static readonly METHODS_INDENT_UNIT_PX: number = 5;
	public static readonly METHODS_METHOD_ANIMATE_TIME: number = 300;
	public static readonly METHODS_SEARCH_TEXT: string = "Refine method list";
	public static readonly METHODS_REQUEST_ERROR_TEXT: string = "We couldn't find any methods in this file. Try another?";
	public static readonly METHODS_LOADING_TEXT: string = "Retrieving methods";
	public static readonly METHOD_NAME_TEXT_SIZE:number = 10;

	public static readonly RESULTS_REQUEST_ERROR_TEXT: string = "There aren't any changes in this method's history! Please try another.";

	public static readonly COMMIT_ROW_HEIGHT: number = 8;
	public static readonly COMMIT_ROW_WIDTH: number = 80;
	public static readonly COMMIT_WIDTH_MODIFIER: number = 5;
	public static readonly COMMIT_CELL_COLOUR_VARIANCE_PCT: number = 12;
	public static readonly COMMIT_FONT_APPROX_SIZE: number = 17;

	public static readonly ABOUT_TEXT_SIZE: number = 100;

	public static readonly LOADING_TEXT: string = "Retrieving.";
	public static readonly LOADING_TEXT_SIZE: number = 100;
}
