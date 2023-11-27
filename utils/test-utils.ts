import axios from 'axios';
import fs from 'node:fs';
export const hostIsSame = ({ rootUrl, url }: { rootUrl: string, url: string }): boolean => getHost({ url: rootUrl }) === getHost({ url });

export const getHost = ({ url }: { url: string }): string => {
    const parts = url.split("/");
    return parts.slice(0, 3).join("/");
};

export const generateRandomString = (): string => Math.floor(Math.random() * Date.now()).toString(36);

export const readFileContent = async ({ path }: { path: string }): Promise<string[]> => {
    try {
        // Check if the path is a URL
        if (path.startsWith('http://') || path.startsWith('https://')) {
            const response = await axios.get(path);
            return response.data.split('\n');
        }
 
        const fileContent = await fs.promises.readFile(path, 'utf8');
        return fileContent.split('\n');
        
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}
