import {getAssetPath, getAssetPathRelativeToDocuments, getBinPath, getPartialPath} from "./files";
import child from "child_process";
import path from "path";

const mmdcPath = getBinPath('mmdc')

function getImageName(partialMermaidFile: string) {
    const fileName = partialMermaidFile.substring(0, partialMermaidFile.lastIndexOf('.'));
    return `generated-${fileName}.svg`;
}

function buildMermaidCommand(partialMermaidFile: string): string {
    const srcPath = getPartialPath(partialMermaidFile);
    const destFile = getImageName(partialMermaidFile);
    const destPath = getAssetPath(destFile);
    return `"${mmdcPath}" -i "${srcPath}" -o "${destPath}"`;
}

export async function updateMermaids(mermaidFiles: string[]): Promise<void> {
    if (mermaidFiles.length > 0) {
        console.log('Re-generate SVGs for Mermaid files:')

        const fileNames = mermaidFiles.map(f => path.basename(f));

        await Promise.all(fileNames.map(async f => {
            const cmd = buildMermaidCommand(f);
            await child.exec(cmd)
            console.log(`\t${f} -> ${getImageName(f)}`)
        }));

        console.log();
    }

}

export function getMarkdownImageLinksForMermaids(files: string[]): string[] {
    return files
        .map(mermaidFile => {
            const assetFile = getImageName(mermaidFile);
            // Avoid backslashes used on Windows machines
            const assetPath = getAssetPathRelativeToDocuments(assetFile).replace(/\\/g, '/');
            const assetName = assetFile.substring(0, assetFile.lastIndexOf('.'));
            const imgRef = `![${assetName}](${assetPath})`;
            return imgRef;
        });
}
