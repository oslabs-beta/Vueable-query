export default hljsGrammar;
declare function hljsGrammar(o: any): {
    name: string;
    aliases: string[];
    keywords: {
        $pattern: string;
        keyword: string[];
        literal: string[];
        built_in: any[];
        "variable.language": string[];
    };
    exports: {
        PARAMS_CONTAINS: any[];
        CLASS_REFERENCE: {
            relevance: number;
            match: any;
            className: string;
            keywords: {
                _: string[];
            };
        };
    };
    illegal: RegExp;
    contains: any[];
};
