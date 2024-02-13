import minimist from "minimist";
import chalk from "chalk";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

import { pathExists, createPathIfNotexists } from "./helper.js";

console.log(
    chalk.green(`Welcome to Image Precess v1.0 
    
    `))

//Esta funcion hace el trabajo de procesado
const processImage = async ({ inputDir, outputDir, watermark, resize }) => {
    
    try {
    // Comprobamos que inputDir existe
        const inputPath = path.resolve(process.cwd(), inputDir);
        const outputPath = path.resolve(process.cwd(), outputDir);

    //Comprobar si existe inputDir
        await pathExists(inputPath);

    // Crear si no existe outputDir
        await createPathIfNotexists(outputPath);

        let watermarkPath;

        if (watermark) {
            watermarkPath = path.resolve(process.cwd(), watermark);
        }

    // Si existe watermark colocar comprobar que el archivo watermark existe
        if (watermarkPath) {
            await pathExists(watermarkPath);
        }

    // Leer los archivos de inputDir
        const inputFiles = await fs.readdir(inputPath);

        console.log(inputFiles);

    // Quedarme solo los archivos que sean imágenes
        const imageFiles = inputFiles.filter((file) => {
            const validExtension = [".jpg", ".jpeg", ".gif", ".png", ".webp"];
            return validExtension.includes(path.extname(file).toLowerCase());
        }); 

    // Recorrer toda la lista de archivos y:
    //  - Si existe "resize" redireccionar cada una de las imágenes
    // - Si existe "watermark" colocar el watermark en la parte inferior derecha de la imagen
    // - Guardar la imágen resultantes en outputDir

    for (const imageFile of imageFiles) {
        console.log(chalk.blue(`Procesando imagen: ${imageFile}`));

        // Creamos la ruta completa de la imagen
        const imagePath = path.resolve(inputPath, imageFile);

        // Cargamos la imagen en sharp
        const image = sharp(imagePath);

        // Si existe resize hacemos el risize
        if (resize) {
            image.resize(resize);
        }

        // SI existe watermarkPath colocamos el watermark
        if (watermarkPath) {
            image.composite([
                {
                    input: watermarkPath,
                    top: 20,
                    left: 20,
                },
            ]);
        }
        // Guardamos la imagen con otro nombre en outputPath
        await image.toFile(path.resolve(outputPath, `processed_${imageFile}`));
    };


    } catch (err) {
        console.error(chalk.red(err.message));
        console.error(chalk.red("Comprueba que los argumentos sean correctos!"));
        process.exit(1);
    }
    
};

// Procoseso los argumentos
const args = minimist(process.argv.slice(2));
const { inputDir, outputDir, watermark, resize } = args;

// Si no existe inputDir o outputDir muestro un error y salgo del programa
if (!inputDir || !outputDir) {
    console.error(chalk.red("Los argumentos --inputDir=img --outputDir=result son obligatorios "));
    process.exit(1);
}

// Si no existe watermark o resize muestro un error y salgo del program
if (!watermark && !resize) {
    console.error(chalk.red("Es necesario que existan un argumento  --watermark o --resize"));
    process.exit(1);
}

// Todos los argumentos son correctos, seguimos
console.log(
    chalk.green(`Procesando Imágenes... `

    ));

processImage({ inputDir, outputDir, watermark, resize });