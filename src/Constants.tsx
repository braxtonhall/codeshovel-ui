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

	public static readonly SERVER_ADDRESS: string = "http://localhost:1234";

	public static readonly INVALID_URL_ERROR_TEXT: string = "Please enter a link to proceed.";

	public static readonly FILE_REQUEST_ERROR_TEXT: string = "We're having trouble checking that out. Please try something else.";
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

	public static readonly RESULTS_REQUEST_ERROR_TEXT: string = "We couldn't find a history for that method! Please try another";

	public static readonly LOADING_TEXT: string = "Retrieving."
}
