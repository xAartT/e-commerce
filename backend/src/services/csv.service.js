const papa = require('papaparse');

exports.parseProductsCSV = (csvContent) => {
  return new Promise((resolve, reject) => {
    papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        try {
          const products = results.data.map((row, index) => {
            const name = row.name?.trim();
            const price = parseFloat(row.price);
            const description = row.description?.trim() || '';
            const image_url = row.image_url?.trim() || null;

            if (!name) {
              throw new Error(`Linha ${index + 2}: Nome do produto é obrigatório`);
            }

            if (isNaN(price) || price < 0) {
              throw new Error(`Linha ${index + 2}: Preço inválido`);
            }

            return {
              name,
              price,
              description,
              image_url
            };
          });

          resolve(products);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Erro ao processar CSV: ${error.message}`));
      }
    });
  });
};

exports.validateCSVStructure = (csvContent) => {
  const requiredColumns = ['name', 'price'];
  
  return new Promise((resolve, reject) => {
    papa.parse(csvContent, {
      header: true,
      preview: 1,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        const headers = results.meta.fields;
        const missingColumns = requiredColumns.filter(
          col => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          reject(new Error(
            `Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`
          ));
        } else {
          resolve(true);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};