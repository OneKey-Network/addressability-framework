import {Document} from "./files";

export const PartialEnd = /^<!--partial-end-->[\s\S]*$/

export const PartialBegin = /^<!--partial-begin *(.*) *-->[\s\S]*$/

/** All type of tokens for a simplified lexing for partials. */
export enum LexerTokenType {
    PlainText = "TEXT",
    PartialBegin = "PARTIAL_BEGIN",
    PartialEnd = "PARTIAL_END"
}

/** Token describing the different part of a document. */
export interface LexerToken {
    type: LexerTokenType;
    text: string;
}

/** Split a content in tokens. */
export function lex({content, lineBreak}: Document): LexerToken[] {
    const tokens = new Array<LexerToken>();
    const lines = getLines(content, lineBreak);
    let textAcc = '';
    lines.forEach(line => {
        if (line.match(PartialBegin)) {
            if (textAcc != '') {
                const token: LexerToken = {
                    type: LexerTokenType.PlainText,
                    text: textAcc
                };
                tokens.push(token);
                textAcc = '';
            }
            const token: LexerToken = {
                type: LexerTokenType.PartialBegin,
                text: line
            };
            tokens.push(token);
        } else if (line.match(PartialEnd)) {
            if (textAcc != '') {
                const token: LexerToken = {
                    type: LexerTokenType.PlainText,
                    text: textAcc
                };
                tokens.push(token);
                textAcc ='';
            }
            const token: LexerToken = {
                type: LexerTokenType.PartialEnd,
                text: line
            }
            tokens.push(token);
        } else {
            textAcc += line;
        }
    });
    if (textAcc != '') {
        const token: LexerToken = {
            type: LexerTokenType.PlainText,
            text: textAcc
        };
        tokens.push(token);
        textAcc ='';
    }
    return tokens;
}

/**
 * Split a content in lines including the separators.
 *
 * @param content String to split in lines
 * @param eolChar separator character (end of line)
 * @returns An array of lines including the separator.
 */
function getLines(content: string, eolChar: string): string[] {
    // Includes an empty "line" AFTER the last separator. Need to remove it
    const lines = content.split(eolChar);
    lines.pop()

    // Re-inject the separator
    return lines.map(line => `${line}${eolChar}`);
}
