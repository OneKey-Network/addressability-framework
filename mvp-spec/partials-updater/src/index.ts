import {
    getChangedFiles,
    getPartialPath,
    listDocuments,
    listMermaidAssets,
    listPartials,
    loadDocument,
    rewriteDocument
} from "./files";
import {lex} from "./lexer";
import {interpret, listUsedPartials} from "./interpretor"
import path from "path";
import {updateMermaids} from "./mermaid";
import { validateJsonFormats, validateJsonSchemas } from "./validate";

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
        await validateJsonFormats()
        await validateJsonSchemas()
        await checkUnusedPartials()
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

async function checkUnusedPartials() {
    const partials = await listPartials()
    const docs = await listDocuments()
    const usedPartials = new Array<string>()
    for (const doc of docs) {
        const document = await loadDocument(doc)
        const tokens = lex(document)
        const partialsFromToken = await listUsedPartials(tokens)
        usedPartials.push(...partialsFromToken)
    }
    for (const p of partials) {
        if (usedPartials.indexOf(p) == -1) {
           console.log(`Partial unused: ${p}`)
        }
    }
}