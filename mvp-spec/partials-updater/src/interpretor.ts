import {
    Document,
    getAssetPath,
    getAssetPathRelativeToDocuments,
    getBinPath,
    getPartialPath,
    loadFile,
    loadPartial,
    rewriteFile
} from "./files";
import {LexerToken, LexerTokenType, PartialBegin} from "./lexer";
import * as jq from "node-jq";
import * as child from 'child_process';

interface PartialConfig {
    files: string[];
    block?: string;
    jq?: string;
    transformation?: string;
}

const mmdcPath = getBinPath('mmdc')

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
                doc += nextToken.text;
                break;
            }
        }
    }
    return doc;
}

async function interpretPartialBeginToken(token: LexerToken, lineBreak: string): Promise<string> {
    const jsonStr = token.text.match(PartialBegin)[1];
    try {
        const config: PartialConfig = JSON.parse(jsonStr);
        if (config.files?.length < 1) {
            throw ''
        }

        if (config.jq !== undefined) {
            const jsonPaths = config.files.map(getPartialPath);
            const options = (config.files.length > 1) ? {slurp: true} : undefined;
            const json = (await jq.run(config.jq, jsonPaths, options)).toString();
            return getPartialInCodeBlock(json, lineBreak);
        }

        if (config.transformation !== undefined) {
            if (config.transformation == "mermaid") {
                return transformMermaids(config, lineBreak);
            } else {
                throw new Error(`Unknown type of Transformation: ${config.transformation}`);
            }
        }

        const partials: Document[] = await Promise.all(config.files.map(loadPartial));

        const merged = partials.map(d => d.content).join(lineBreak)

        return config.block ? getPartialInCodeBlock(merged, lineBreak, config.block) : merged;
    } catch (e) {
        throw new Error(`Partial with bad configuration: ${token.text} - ${e}`)
    }
}

async function transformMermaids(config: PartialConfig, lineBreak: string) {
    const cmdAndPaths = config.files.map(buildMermaidCommand);
    for (const val of cmdAndPaths) {
        child.execSync(val.cmd);
        // Remove id from generated file
        const generatedPath = getAssetPath(val.assetFile);
        const generatedDoc = await loadFile(generatedPath)
        await rewriteFile(generatedPath, generatedDoc.content.replace(/^<svg id\=\"[^"]*"/, "<svg "))
    }
    const contents = cmdAndPaths.map((val) => {
        const assetFile = val.assetFile;
        const assetPath = getAssetPathRelativeToDocuments(assetFile);
        const assetName = assetFile.substring(0, assetFile.lastIndexOf('.'));
        const imgRef = `![${assetName}](${assetPath})`;
        return imgRef;
    });
    return contents.join(lineBreak) + lineBreak;
}

function buildMermaidCommand(partialFile): { cmd: string; assetFile: string; } {
    const fileName = partialFile.substring(0, partialFile.lastIndexOf('.'));
    const destFile = `generated-${fileName}.svg`;
    const destPath = getAssetPath(destFile);
    const srcPath = getPartialPath(partialFile);
    const cmd = `"${mmdcPath}" -i "${srcPath}" -o "${destPath}"`;
    return {cmd: cmd, assetFile: destFile};
}

function getPartialInCodeBlock(partial: string, lineBreak: string, type: string = "json"): string {
    return `\`\`\`${type}${lineBreak}${partial}${lineBreak}\`\`\`${lineBreak}`;
}
