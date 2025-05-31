const FormData = require("form-data"),
  Jimp = require("jimp");

async function remini(imageBuffer, enhancementType) {
  return new Promise(async (resolve, reject) => {
    const validEnhancements = ["enhance", "recolor", "dehaze"];

    // Validate and set enhancement type
    enhancementType = validEnhancements.includes(enhancementType) ? enhancementType : validEnhancements[0];

    const formData = new FormData();
    const apiUrl = "https://inferenceengine.vyro.ai/" + enhancementType;

    // Add model version to form data
    formData.append("model_version", 1, {
      "Content-Transfer-Encoding": "binary",
      contentType: "multipart/form-data; charset=utf-8",
    });

    // Add image to form data
    formData.append("image", Buffer.from(imageBuffer), {
      filename: "enhance_image_body.jpg",
      contentType: "image/jpeg",
    });

    // Submit the form data
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
          reject(error);
          return;
        }

        const chunks = [];
        response
          .on("data", function (chunk) {
            chunks.push(chunk);
          })
          .on("end", () => {
            resolve(Buffer.concat(chunks));
          });

        response.on("error", (err) => {
          reject(err);
        });
      }
    );
  });
}

module.exports.remini = remini; 