import { listDocuments, rewriteDocument, loadDocument } from "./files";
import { lex } from "./lexer"; 
import { interpret } from "./interpretor"

async function update() {
    const docs = await listDocuments();
    for (const doc of docs) {
        const content = await loadDocument(doc)
        const tokens = lex(content);
        try {
            const processedContent = await interpret(tokens);
            if (processedContent != content) {
                await rewriteDocument(doc, processedContent);
                console.log(`Document updated: ${doc}`);
            }
        } catch (e) {
            const wrapError = new Error(`Error in file "${doc}"\n${e}`);
            throw wrapError;
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