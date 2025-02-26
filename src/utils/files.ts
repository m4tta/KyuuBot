import { PromiseResolver } from './../types/PromiseResolver';
import { createWriteStream, readdir } from 'fs';
import { unlink } from 'fs/promises';
import { promisify } from 'util';
import path from 'path';
import got from 'got';

export const saveImageToTmp = async (url: string, writePath: string): Promise<PromiseResolver> => {
    // todo: make a database and cache all chapters instead of getting them per request
    return new Promise((resolve, reject) => {
        const fetchStream = got.stream(url);

        fetchStream.pipe(createWriteStream(writePath));

        fetchStream.on('error', () => {
            reject(new Error('Failed to download image'));
        });

        fetchStream.on('end', () => {
            resolve({ success: true });
        });
    });
};

export const deleteFileFromTmp = async (filePath: string): Promise<PromiseResolver> => {
    return new Promise(async (resolve) => {
        try {
            await unlink(filePath);
            return resolve({ success: true })
        } catch (error) {
            return resolve({ success: false, message: `Attempt to delete ${filePath} failed. Filename does not exist.` });
        }
    });
};

export const isUrlExtensionStatic = (url: string): boolean => {
    return ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp'].includes(getFileExtension(url));
};

export const getFileExtension = (url: string): string => { // todo: probably make this a util
    const fileExtension = url.split(/[#?]/)[0].split('.').pop().trim();
    return fileExtension;
};

export const getRandomEmotePath = async () => {
    const emoteDir = path.normalize(path.join(__dirname, '../../emotes'));
    return await promisify(readdir)(emoteDir).then(async (filenames) => {
        const randomIndex = Math.floor(Math.random() * filenames.length);
        const randomImageName = filenames[randomIndex];
        return path.normalize(path.join(emoteDir, '/', randomImageName));
    });
};