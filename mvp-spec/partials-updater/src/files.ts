import RootPath from "app-root-path";
import fs from "fs";
import path from "path";

const BinDir = path.join(RootPath.path, "node_modules", ".bin");
const AssetsDir = path.join(RootPath.path, "..", "assets");
const AssetPathForDocuments = path.join(".", "assets");
const PartialsDir = path.join(RootPath.path, "..", "partials");
const DocumentsDir = path.join(RootPath.path, "..");
const DocumentExts = [ ".md" ]


export const getBinPath = (bin: string): string => path.join(BinDir, bin);

export const getAssetPath = (file: string): string => path.join(AssetsDir, file);

export const getAssetPathRelativeToDocuments = (file: string): string => path.join(AssetPathForDocuments, file);

export const getPartialPath = (file: string): string => path.join(PartialsDir, file);

/** Load a partial based on its name. */
export const loadPartial = (file: string): Promise<string> => loadFile(file, PartialsDir);

/** Load a document based on its name. */
export const loadDocument = (file: string): Promise<string> => loadFile(file, DocumentsDir);

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

async function loadFile(name: string, dir: string): Promise<string> {
    const fullPath = path.join(dir, name);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File doesn't exist. Cannot load: ${fullPath}`)
    }
    const content = await fs.promises.readFile(fullPath);
    const contentStr = content.toString();
    return contentStr;
}

const isDocument = (file :string): boolean => DocumentExts.some(e => file.endsWith(e));

async function listFiles(dir: string, filter: (n: string) => boolean): Promise<string[]> {
    const files = await fs.promises.readdir(dir);
    const filtered = files.filter(filter);
    return filtered;
}
