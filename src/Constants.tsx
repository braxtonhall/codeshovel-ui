import {IMethodTransport} from "./Types";

export class Constants {
	public static readonly EXAMPLE_LINKS: string[] = [
		"https://github.com/apache/commons-lang",
		"https://github.com/apache/flink",
		// "https://github.com/apache/lucene-solr",
		"https://github.com/checkstyle/checkstyle",
		"https://github.com/eclipse/jetty.project",
		// "https://github.com/hibernate/hibernate-orm",
		// "https://github.com/hibernate/hibernate-search",
		"https://github.com/javaparser/javaparser",
		// "https://github.com/JetBrains/intellij-community",
		"https://github.com/kiegroup/drools",
		"https://github.com/mockito/mockito",
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
		Ybodychange: "Body Change",
		Yfilerename: "File Rename",
		Yintroduced: "Method Introduced",
		Yexceptionschange: "Exceptions Change",
		Ymodifierchange: "Modifier Change",
		Ymovefromfile: "Move From File",
		Ymultichange: "Multiple Changes",
		Ynochange: "No Change",
		Yparameterchange: "Parameter Change",
		Yparametermetachange: "Parameter Meta Change",
		Yrename: "Rename",
		Yreturntypechange: "Return Type Change"
	};

	public static readonly IN_TEST: boolean = true;

	public static readonly NOTIFICATION_DISPLAY_TIME: number = 3000;

	public static readonly SERVER_ADDRESS: string = "http://localhost:8080";

	public static readonly INVALID_URL_ERROR_TEXT: string = "Please enter a link to proceed.";

	public static readonly SERVER_BUSY_ERROR_TEXT: string = "The server is under heavy load. Please try again in a moment!";
	public static readonly INTERNAL_ERROR_TEXT: string = "The server is having trouble processing this specific request. Please try another.";

	public static readonly FILE_REQUEST_ERROR_TEXT: string = "There don't appear to be any .java files in this repo. Please try another.";
	public static readonly FILE_LOADING_TEXT: string = "Retrieving files";
	public static readonly FILE_SHA_PLACEHOLDER_TEXT: string = "Specific commit? Enter the SHA here and reload";
	public static readonly FILE_SHA_ERROR_TEXT: string = "Enter a SHA to refresh";

	public static readonly LIST_ELEMENT_NEW_LINE_PX_COUNT: number = 15;

	public static readonly METHODS_MAX_INDENT_UNIT_COUNT: number = 20;
	public static readonly METHODS_INDENT_UNIT_PX: number = 5;
	public static readonly METHODS_METHOD_ANIMATE_TIME: number = 300;
	public static readonly METHODS_SEARCH_TEXT: string = "Refine method list";
	public static readonly METHODS_REQUEST_ERROR_TEXT: string = "We couldn't find any methods in this file. Try another?";
	public static readonly METHODS_LOADING_TEXT: string = "Retrieving methods";

	public static readonly RESULTS_REQUEST_ERROR_TEXT: string = "There aren't any changes in this method's history! Please try another.";

	public static readonly LOADING_TEXT: string = "Retrieving."
}
