import fs from "fs/promises";
import path from "path";



// Funcion que comprueba un path si existe en disco
export const pathExists = async (path) => {
    try {
        await fs.access(path);
    } catch {
        throw new Error(`La ruta ${path} no existe`);
    }
};

//Funcion que crea una ruta en disco si no existe
export const createPathIfNotexists = async (path) => {
    try {
        await fs.access(path);
    } catch {
        await fs.mkdir(path);
    }
};