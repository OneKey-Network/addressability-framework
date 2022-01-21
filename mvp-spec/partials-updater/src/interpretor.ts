import {Document, getPartialPath, loadPartial} from "./files";
import {LexerToken, LexerTokenType, PartialBegin} from "./lexer";
import * as jq from "node-jq";

interface PartialConfig {
    files: string[];
    block?: string;
    jq?: string;
}

/** Interpret the token to generate the content. */
export async function interpret(tokens: LexerToken[], eolChar: string): Promise<string> {
    let doc = '';
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        switch (token.type) {
            case LexerTokenType.PlainText: {
                doc += token.text;
                break;
            }
            case LexerTokenType.PartialEnd: {
                throw new Error("Partial end without Partial Begin");
            }
            case LexerTokenType.PartialBegin: {
                i++;
                if (i == tokens.length) {
                    throw new Error(`Partial Begin without Partial End: ${token.text}`);
                }
                let nextToken = tokens[i];
                if (nextToken.type == LexerTokenType.PlainText) {
                    i++;
                    if (i == tokens.length) {
                        throw new Error(`Partial Begin without Partial End: ${token.text}`);
                    }
                }
                nextToken = tokens[i];
                if (nextToken.type != LexerTokenType.PartialEnd) {
                    throw new Error(`Partial Begin without Partial End: ${token.text}`);
                }
                doc += token.text;
                doc += "<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->" + eolChar;
                doc += await interpretPartialBeginToken(token, eolChar);
                doc += nextToken.text;
                break;
            }
        }
    }
    return doc;
}

async function interpretPartialBeginToken(token: LexerToken, eolChar: string) : Promise<string> {
    const jsonStr = token.text.match(PartialBegin)[1];
    try {
        const config: PartialConfig = JSON.parse(jsonStr);
        if (!config.hasOwnProperty('files') && config.files.length >= 1) {
            throw ''
        }

        if (config.hasOwnProperty('jq')) {
            const jsonPaths = config.files.map(getPartialPath);
            const options = (config.files.length > 1) ? { slurp: true } : undefined;
            const json = (await jq.run(config.jq, jsonPaths, options)).toString();
            return getPartialInCodeBlock(json, eolChar);
        }

        const partials: Document[] = await Promise.all(config.files.map(loadPartial));
        const lineBreak = partials[0].eolChar;
        let merged = partials.map(d => d.content).join(lineBreak)

        if (config.hasOwnProperty('block')) {
            merged = getPartialInCodeBlock(merged, eolChar, config.block);
        }
        return merged;
    } catch (e) {
        throw new Error(`Partial with bad configuration: ${token.text} - ${e}`)
    }
}

function getPartialInCodeBlock(partial: string, eolChar:string, type: string = "json"): string {
    return `\`\`\`${type}${eolChar}${partial}${eolChar}\`\`\`${eolChar}`;
}
