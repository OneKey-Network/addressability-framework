import {getPartialPath, loadPartial} from "./files";
import {LexerToken, LexerTokenType, PartialBegin} from "./lexer";
import * as jq from "node-jq";

interface PartialConfig {
    files: string[];
    block?: string;
    jq?: string;
    transformation?: string;
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
        
        if (config.jq !== undefined) {
            const jsonPaths = config.files.map(getPartialPath);
            const options = (config.files.length > 1) ? { slurp: true } : undefined;
            const json = (await jq.run(config.jq, jsonPaths, options)).toString();
            const partial = getPartialInCodeBlock(json, eolChar);
            return partial;
        } 

        if (config.transformation !== undefined) {
            if (config.transformation == "mermaid") {
                return transformMermaids(config);
            } else {
                throw new Error(`Unknown type of Transformation: ${config.transformation}`);
            }
        }

        const partials: Document[] = await Promise.all(config.files.map(loadPartial));
        const lineBreak = partials[0].eolChar;
        let merged = partials.map(d => d.content).join(lineBreak)

        if (config.block !== undefined) {
            merged = getPartialInCodeBlock(merged, lineBreak, config.block);
        }
        return merged;
    } catch (e) {
        throw new Error(`Partial with bad configuration: ${token.text} - ${e}`)
    }
}

async function transformMermaids(config: PartialConfig) {
    const lineBreak = getLineBreakSymbol(config.files[0]);
    const cmdAndPathes = config.files.map(buildMermaidCommand);
    cmdAndPathes.forEach((val) => {
        child.execSync(val.cmd);
    });
    const contents = cmdAndPathes.map((val) => {
        const assetFile = val.assetFile;
        const assetPath = getAssetPathRelativeToDocuments(assetFile);
        const assetName = assetFile.substring(0, assetFile.lastIndexOf('.'));
        const imgRef = `![${assetName}](${assetPath})`;
        return imgRef;
    });
    let joined = contents.join(lineBreak);
    return joined;
}

function buildMermaidCommand(partialFile): { cmd: string; assetFile: string; } {
    const fileName = partialFile.substring(0, partialFile.lastIndexOf('.'));
    const destFile = `generated-${fileName}.svg`;
    const destPath = getAssetPath(destFile);
    const srcPath = getPartialPath(partialFile);
    const binPath = getBinPath('mmdc');
    const cmd = `"${binPath}" -i "${srcPath}" -o "${destPath}"`;
    return { cmd: cmd, assetFile: destFile};
}

function getPartialInCodeBlock(partial: string, eolChar:string, type: string = "json"): string {
    return `\`\`\`${type}${eolChar}${partial}${eolChar}\`\`\`${eolChar}`;
}
