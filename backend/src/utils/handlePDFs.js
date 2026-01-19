const fs = require("fs");
const path = require("path");
const pdf = require("pdf-poppler");

async function handlePDFs(pdfPath, outputDir) {
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });

    const timeStamp = Date.now();
    const baseName = path.basename(pdfPath, path.extname(pdfPath));
    const outPrefix = `${baseName}_${timeStamp}`;

    let opts = {
      format: "png",
      out_dir: outputDir,
      out_prefix: outPrefix,
      page: null,
      scale: 1500,
    };

    console.log("Converting pdf file to images");
    await pdf.convert(pdfPath, opts);

    const files = await fs.promises.readdir(outputDir);
    const imageFiles = files
      .filter((file) => file.startsWith(outPrefix) && file.endsWith(".png"))
      .sort((a, b) => {
        const pageA = parseInt(a.match(/-(\d+)\.png$/)?.[1] || 0);
        const pageB = parseInt(b.match(/-(\d+)\.png$/)?.[1] || 0);
        return pageA - pageB;
      });

    console.log(`Found ${imageFiles.length} image files`);

    const base64Images = [];

    for (const imageFile of imageFiles) {
      const imagePath = path.join(outputDir, imageFile);
      const base64 = await convertImageToBase64(imagePath);
      base64Images.push(base64);
    }

    return base64Images;
  } catch (error) {
    console.error("Error in PDF conversion:", error);
    throw error;
  }
}

const convertImageToBase64 = async (imagePath) => {
  try {
    const imageBuffer = await fs.promises.readFile(imagePath);
    const base64Image = imageBuffer.toString("base64");

    return base64Image;
  } catch (error) {
    console.error(`Error converting ${imagePath} to base64:`, error);
    throw error;
  } finally {
    //await fs.promises.unlink(imagePath);
  }
};

module.exports = { handlePDFs };
