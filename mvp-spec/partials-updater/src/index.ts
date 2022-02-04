import {
    getChangedFiles,
    getPartialPath,
    listDocuments,
    listMermaidAssets,
    loadDocument,
    rewriteDocument
} from "./files";
import {lex} from "./lexer";
import {interpret} from "./interpretor"
import path from "path";
import {updateMermaids} from "./mermaid";

async function update() {
    await updateModifiedMermaids();
    const docs = await listDocuments();
    for (const doc of docs) {
        const document = await loadDocument(doc)
        const tokens = lex(document);
        try {
            const processedContent = await interpret(tokens, document.lineBreak);
            if (processedContent != document.content) {
                await rewriteDocument(doc, processedContent);
                console.log(`Document updated: ${doc}`);
            }
        } catch (e) {
            throw new Error(`Error in file "${doc}"\n${e}`);
        }
    }
}

(async () => {
    try {
        await update();
    } catch (error) {
        console.error(error);
    }
})();

async function updateModifiedMermaids() {
    const changedFiles = await getChangedFiles();
    const mermaidFiles = (await listMermaidAssets()).map(p => path.relative(process.cwd() as string, getPartialPath(p)));

    const modifiedMermaidFiles = mermaidFiles.filter(f => changedFiles.includes(f))
    await updateMermaids(modifiedMermaidFiles)
}
