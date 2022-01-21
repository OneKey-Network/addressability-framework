import RootPath from "app-root-path";
import fs from "fs";
import path from "path";

const PartialsDir = path.join(RootPath.path, "..", "partials");
const DocumentsDir = path.join(RootPath.path, "..");
const DocumentExts = [".md"]

export const getPartialPath = (file: string): string => path.join(PartialsDir, file);

/** Load a partial based on its name. */
export const loadPartial = (file: string): Promise<Document> => loadFile(file, PartialsDir);

/** Load a document based on its name. */
export const loadDocument = (file: string): Promise<Document> => loadFile(file, DocumentsDir);

/** List the documents by names. */
export const listDocuments = (): Promise<string[]> => listFiles(DocumentsDir, isDocument);

/** Rewrite a document. */
export function rewriteDocument(name: string, content: string): Promise<void> {
    const fullPath = path.join(DocumentsDir, name);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File doesn't exist. Cannot rewrite: ${fullPath}`)
    }
    return fs.promises.writeFile(fullPath, content);
}

function getDocumentSeparator(content: string) {
    return (content.match(/\r\n|\r|\n/))[0];
}

export interface Document {
    content: string,
    eolChar: string
}

async function loadFile(name: string, dir: string): Promise<Document> {
    const fullPath = path.join(dir, name);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File doesn't exist. Cannot load: ${fullPath}`)
    }
    const data = await fs.promises.readFile(fullPath);
    const content = data.toString();
    return {content, eolChar: getDocumentSeparator(content)};
}

const isDocument = (file: string): boolean => DocumentExts.some(e => file.endsWith(e));

async function listFiles(dir: string, filter: (n: string) => boolean): Promise<string[]> {
    const files = await fs.promises.readdir(dir);
    const filtered = files.filter(filter);
    return filtered;
}
