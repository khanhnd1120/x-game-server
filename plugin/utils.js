const fs = require("fs");

const writeFile = async (pathFile, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(pathFile, data, (error) => {
      if (error) return reject(error);

      return resolve(true);
    });
  });

function* range(start, end, step) {
  while (start <= end) {
    yield start;
    start += step;
  }
}

const formatValue = (value) => {
  try {
    if (!value && value != 0) return null;
    if (parseFloat(value) >= 0) return parseFloat(value);
    if (value === "") return null;
    if (value === 'false' || value === 'FALSE') return false;
    if (value === 'true' || value === 'TRUE') return true;
    else {
      return `${value}`;
    }
  } catch (err) {
    return `${value}`;
  }
};


const generateArrayTwoLayer = ({
  sheet,
  dataset,
  reverse = false,
  multiplyValue = 1,
  double = false,
  type = "field",
  isLog = false,
  poolKeyData = [],
  fieldKeyData = null,
}) => {
  try {
    if (isLog) {
      console.log(type);
    }
    switch (type) {
      case "fieldNumber": {
        const data = dataset.fieldNumber.map((num) => {
          const res = reverse ? dataset.fieldCharacter.reverse() : dataset.fieldCharacter;
          const data = res
            .map((character) => {
              const cell = character + num;
              const valueCell = sheet.getCellByA1(cell).value;
              if (fieldKeyData == character && poolKeyData.length > 0) {
                const valuePercent = poolKeyData.indexOf(valueCell.toString()) + 1;
                return double ? `${valuePercent}, ${valuePercent}` : valuePercent;
              }
              const valuePercent = valueCell * multiplyValue;
              return double ? `${valuePercent}, ${valuePercent}` : valuePercent;
            })
            .join(", ");
          return "[" + data.slice(0, data.length) + "]";
        });
        if (isLog) {
          console.log(data);
        }
        return data;
      }
      case "field": {
        const data = dataset.fieldNumber.map((num) => {
          const res = reverse ? dataset.fieldCharacter.reverse() : dataset.fieldCharacter;
          const data = res
            .map((character) => {
              const cell = character + num;
              const valueCell = sheet.getCellByA1(cell).value;
              return valueCell
            })
          return data;
        });
        if (isLog) {
          console.log(data);
        }
        return data;
      }
      case "fieldCharacter": {
        const data = dataset.fieldCharacter.map((character) => {
          const res = reverse ? dataset.fieldNumber.reverse() : dataset.fieldNumber;
          const data = res
            .map((num) => {
              const cell = character + num;
              let valueCell = sheet.getCellByA1(cell).value;
              if (multiplyValue !== 1) valueCell = valueCell * multiplyValue;
              return double ? `${valueCell}, ${valueCell}` : valueCell;
            })
            .join(", ");

          return "[" + data.slice(0, data.length) + "]";
        });
        if (isLog) {
          console.log(data);
        }
        return data;
      }
    }
  } catch (err) {
    console.log(err);
  }
};


module.exports = {
  writeFile,
  range,
  generateArrayTwoLayer
};
