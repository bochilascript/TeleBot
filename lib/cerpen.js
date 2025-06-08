const cerpenData = require("./cerpen_data.json");

function cerpen(category) {
  return new Promise((resolve, reject) => {
    const filtered = cerpenData.filter((c) =>
      c.kategori.toLowerCase().includes(category.toLowerCase())
    );
    if (filtered.length === 0)
      return reject(new Error("Kategori tidak ditemukan."));
    const hasil = filtered[Math.floor(Math.random() * filtered.length)];
    resolve(hasil);
  });
}

module.exports = { cerpen };
