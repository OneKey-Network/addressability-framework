import RootPath from "app-root-path";
import fs from "fs";
import path from "path";
import gitChangedFiles from "git-changed-files";
import {EOL} from "os";

const binDir = path.join(RootPath.path, "node_modules", ".bin");
const assetsDir = path.join(RootPath.path, "..", "assets");
const assetPathForDocuments = path.join(".", "assets");
const partialsDir = path.join(RootPath.path, "..", "partials");
const documentsDir = path.join(RootPath.path, "..");
const documentExts = [".md"]
const mermaidExts = [".mmd"]

export const getBinPath = (bin: string): string => path.join(binDir, bin);

export const getAssetPath = (file: string): string => path.join(assetsDir, file);

export const getAssetPathRelativeToDocuments = (file: string): string => path.join(assetPathForDocuments, file);

export const getPartialPath = (file: string): string => path.join(partialsDir, file);

/** Load a partial based on its name. */
export const loadPartial = (file: string): Promise<Document> => loadFile(path.join(partialsDir, file));

/** Load a document based on its name. */
export const loadDocument = (file: string): Promise<Document> => loadFile(path.join(documentsDir, file));

/** List the documents by names. */
export const listDocuments = (): Promise<string[]> => listFiles(documentsDir, isDocument);

export const listMermaidAssets = (): Promise<string[]> => listFiles(partialsDir, isMermaid);

export const listPartials = (): Promise<string[]> => listFiles(partialsDir, isPartial);

const isDocument = (file: string): boolean => documentExts.some(e => file.endsWith(e));
const isMermaid = (file: string): boolean => mermaidExts.some(e => file.endsWith(e));
const isPartial = (file: string): boolean => true;

/** Rewrite a file */
export function rewriteFile(fullPath: string, content: string): Promise<void> {
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File doesn't exist. Cannot rewrite: ${fullPath}`)
    }
    return fs.promises.writeFile(fullPath, content);
}

/** Rewrite a document. */
export function rewriteDocument(name: string, content: string): Promise<void> {
    const fullPath = path.join(documentsDir, name);
    return rewriteFile(fullPath, content);
}

function getDocumentSeparator(content: string) {
    const match = content.match(/\r\n|\r|\n/);
    // Some files just don't have an end of line => use the system default in this case
    return match?.[0] ?? EOL;
}

export interface Document {
    content: string,
    lineBreak: string
}

export async function loadFile(fullPath: string): Promise<Document> {
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File doesn't exist. Cannot load: ${fullPath}`)
    }
    const data = await fs.promises.readFile(fullPath);
    const content = data.toString();
    return {content, lineBreak: getDocumentSeparator(content)};
}

async function listFiles(dir: string, filter: (n: string) => boolean): Promise<string[]> {
    const files = await fs.promises.readdir(dir);
    const filtered = files.filter(filter);
    return filtered;
}

/**
 * Return the list of files seen as modified by GIT
 */
export async function getChangedFiles(): Promise<string[]> {
    const {committedFiles, unCommittedFiles} = await gitChangedFiles({baseBranch: 'main'});
    return [...committedFiles, ...unCommittedFiles]
}
