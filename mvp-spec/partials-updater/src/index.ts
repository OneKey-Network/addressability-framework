import {listDocuments, loadDocument, rewriteDocument} from "./files";
import {lex} from "./lexer";
import {interpret} from "./interpretor"

async function update() {
    const docs = await listDocuments();
    for (const doc of docs) {
        const document = await loadDocument(doc)
        const tokens = lex(document);
        try {
            const processedContent = await interpret(tokens, document.eolChar);
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
