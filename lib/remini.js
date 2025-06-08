const FormData = require("form-data"),
  Jimp = require("jimp");

async function remini(imageBuffer, enhancementType) {
  return new Promise(async (resolve, reject) => {
    const validEnhancements = ["enhance", "recolor", "dehaze"];
    enhancementType = validEnhancements.includes(enhancementType)
      ? enhancementType
      : validEnhancements[0];

    const formData = new FormData();
    const apiUrl = "https://inferenceengine.vyro.ai/" + enhancementType;

    formData.append("model_version", 1, {
      "Content-Transfer-Encoding": "binary",
      contentType: "multipart/form-data; charset=utf-8",
    });

    formData.append("image", Buffer.from(imageBuffer), {
      filename: "enhance_image_body.jpg",
      contentType: "image/jpeg",
    });

    formData.submit(
      {
        url: apiUrl,
        host: "inferenceengine.vyro.ai",
        path: "/" + enhancementType,
        protocol: "https:",
        headers: {
          "User-Agent": "okhttp/4.9.3",
          Connection: "Keep-Alive",
          "Accept-Encoding": "gzip",
        },
      },
      function (error, response) {
        if (error) {
          console.error("Remini API error:", error);
          resolve(imageBuffer);
          return;
        }

        if (response.statusCode !== 200) {
          console.error("Remini API returned status:", response.statusCode);
          resolve(imageBuffer);
          return;
        }

        const chunks = [];
        response
          .on("data", function (chunk) {
            chunks.push(chunk);
          })
          .on("end", () => {
            const resultBuffer = Buffer.concat(chunks); 
            if (resultBuffer.length === 0) {
              console.error("Remini API returned empty buffer");
              resolve(imageBuffer);
              return;
            }
            resolve(resultBuffer);
          });

        response.on("error", (err) => {
          console.error("Remini API response error:", err);
          resolve(imageBuffer);
        });
      }
    );
  });
}

module.exports.remini = remini;
