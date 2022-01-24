import RootPath from "app-root-path";
import fs from "fs";
import path from "path";

const binDir = path.join(RootPath.path, "node_modules", ".bin");
const assetsDir = path.join(RootPath.path, "..", "assets");
const assetPathForDocuments = path.join(".", "assets");
const partialsDir = path.join(RootPath.path, "..", "partials");
const documentsDir = path.join(RootPath.path, "..");
const documentExts = [ ".md" ]


export const getBinPath = (bin: string): string => path.join(binDir, bin);

export const getAssetPath = (file: string): string => path.join(assetsDir, file);

export const getAssetPathRelativeToDocuments = (file: string): string => path.join(assetPathForDocuments, file);

export const getPartialPath = (file: string): string => path.join(partialsDir, file);

/** Load a partial based on its name. */
export const loadPartial = (file: string): Promise<Document> => loadFile(file, partialsDir);

/** Load a document based on its name. */
export const loadDocument = (file: string): Promise<Document> => loadFile(file, documentsDir);

/** List the documents by names. */
export const listDocuments = (): Promise<string[]> => listFiles(documentsDir, isDocument);

/** Rewrite a document. */
export function rewriteDocument(name: string, content: string): Promise<void> {
    const fullPath = path.join(documentsDir, name);
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

const isDocument = (file: string): boolean => documentExts.some(e => file.endsWith(e));

async function listFiles(dir: string, filter: (n: string) => boolean): Promise<string[]> {
    const files = await fs.promises.readdir(dir);
    const filtered = files.filter(filter);
    return filtered;
}
