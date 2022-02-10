import {Document, getPartialPath, loadPartial} from "./files";
import {LexerToken, LexerTokenType, PartialBegin} from "./lexer";
import * as jq from "node-jq";
import {getMarkdownImageLinksForMermaids} from "./mermaid";

interface PartialConfig {
    files: string[];
    block?: string;
    jq?: string;
    transformation?: string;
}

export class ConfigException extends Error {
    constructor(jsonStr: string, message: string) {
        super(`Partial with bad configuration ${jsonStr}: ${message}`);
    }
}

/** Interpret the token to generate the content. */
export async function interpret(tokens: LexerToken[], lineBreak: string): Promise<string> {
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
                doc += "<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->" + lineBreak;
                doc += await interpretPartialBeginToken(token, lineBreak);
                doc += lineBreak;
                doc += nextToken.text;
                break;
            }
        }
    }
    return doc;
}

const getInBlock = (block: string, partialText: string, lineBreak: string) =>
    [
        "```" + block,
        partialText,
        "```"
    ].join(lineBreak);

async function interpretPartialBeginToken(token: LexerToken, lineBreak: string): Promise<string> {
    const text = token.text;

    const match = text.match(PartialBegin);
    if (match?.length < 2) {
        throw new ConfigException(text, 'invalid syntax')
    }

    const jsonStr = match[1];
    let config: PartialConfig;

    try {
        config = JSON.parse(jsonStr);
    } catch (e) {
        throw new ConfigException(jsonStr, e)
    }

    if (config.files?.length < 1) {
        throw new ConfigException(jsonStr, 'You must configure at least one file')
    }

    let partialText: string;

    if (config.jq !== undefined) {
        const jsonPaths = config.files.map(getPartialPath);
        const options = (config.files.length > 1) ? {slurp: true} : undefined;
        partialText = (await jq.run(config.jq, jsonPaths, options)).toString();
    } else if (config.transformation !== undefined) {
        if (config.transformation == "mermaid") {
            partialText = getMarkdownImageLinksForMermaids(config.files).join(lineBreak);
        } else {
            throw new ConfigException(jsonStr, `Unknown type of Transformation: ${config.transformation}`);
        }
    } else {
        const partials: Document[] = await Promise.all(config.files.map(loadPartial));
        // trim content to remove last empty line
        partialText = partials.map(d => d.content.trim()).join(lineBreak)
    }

    if (config.block !== undefined) {
        return getInBlock(config.block, partialText, lineBreak)
    } else {
        return partialText
    }
}

