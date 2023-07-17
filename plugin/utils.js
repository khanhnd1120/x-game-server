const fs = require("fs");

const EffectType = [
  "knockback",
  "burned",
  "poisoned",
  "paralyzed",
  "confused",
  "sleepy",
  "slowed",
  "heal",
  "shield",
  "revive",
  "debuff",
  "debuffmag",
  "debuffstu",
  "debuffagr",
  "lockheal",
  "lockeng",
  "die",
  'energy vamp',
  'charging',
  'regen'
];

const TRGType = ["LP", "MG", "TRP", "ANY"];

const AOEType = ["Single", "Square", "Ray", "Link", "Range"];

const EDUType = ["D", "P"];

const RarityType = ["C", "UC", "R", "E", "L"];

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

const generateTroopPartStat = ({ sheet, dataset, rarity, race }) => {
  const numbers = Array.from(range(dataset.from, dataset.to, 1));
  const characters = dataset.fieldCharacter;
  const id = dataset.id;
  const STEP2 = race.length;
  let result = [];

  numbers.forEach((num) => {
    const idValue = sheet.getCellByA1(id + num).value.toString();
    let subArr = [];
    let res = [];
    let count = 0;
    characters.forEach((character) => {
      const cell = character + num;
      const value = sheet.getCellByA1(cell).value;
      subArr.push(value);
      count++;
      if (count === STEP2) {
        res.push(subArr);
        subArr = [];
        count = 0;
      }
    });

    result.push({
      data: res,
      code: idValue
    });
  });
  return result;
};

const removeItemOnce = (arr, value) => {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};

const findIndex = (arr, value) => {
  const index = arr.indexOf(value);
  return index >= 0 ? index : null;
};

const generateSkillData = ({ tableName, dataset, sheet, fields, detail = null }) => {
  let nums = Array.from(range(dataset.from, dataset.to, 1));
  let idField = dataset.idField;
  dataset.ignoreNum.forEach((e) => {
    nums = removeItemOnce(nums, e);
  });
  const fieldName = dataset.fieldName;
  const fieldChar = dataset.fieldCharacter;
  let data = [];
  let filedata = [];

  nums.forEach((num, i) => {
    let id = sheet.getCellByA1(idField + num).value;
    id = Number(id)
    let obj = {};
    const rows = fieldChar
      .map((char, index) => {
        const cell = char + num;
        let cellData = sheet.getCellByA1(cell).value;
        if (fieldName[index] == "trg") {
          cellData = findIndex(TRGType, cellData);
        } else if (fieldName[index] == "aoe") {
          cellData = findIndex(AOEType, cellData);
        } else if (fieldName[index] == "eff") {
          cellData = findIndex(EffectType, cellData?.toString().toLowerCase());
        } else if (fieldName[index] == "speed") {
          return `${formatValue(cellData)}, ${cellData ? 0 : 1}`;
        } else if (fieldName[index] == "edu") {
          cellData = findIndex(EDUType, cellData);
        } else if (fieldName[index] == "rarity") {
          cellData = findIndex(RarityType, cellData);
        } else if (["is_elite, is_projectile"].includes(fieldName[index])) {
          cellData = cellData.toString().toLowerCase();
          if (cellData == 'false') {
            cellData = 0;
          } else if (cellData == 'true') {
            cellData = 1;
          } else {
            console.log(cellData)
          }
        }
        return formatValue(cellData);
      }).join(",")

    let data = [id, ...rows.split(",").map(e => formatValue(e)), '2021-11-14 14:30:35', '2021-11-14 14:30:35', 0]

    let fieldsData = fields.split(",")

    fieldsData.forEach((field, idx) => {
      obj[field.replace(" ", "")] = data[idx];
    })
    filedata.push(obj);
    if ([7, 8, 9].includes(obj.eff)) {
      obj.target_group = 1;
    }
    detail && data.push(sheet.getCellByA1(detail + num).value);
  });

  filedata = filedata.sort((a,b) => a.id - b.id);

  return { filedata, data };
};

const getListNumber = ({ from, to, ignoreNumbers = [] }) => {
  let nums = Array.from(range(from, to, 1));
  ignoreNumbers.forEach((e) => {
    nums = removeItemOnce(nums, e);
  });
  return nums;
}

const generateInsertData = ({ tableName, dataset, sheet, fields, detail = null, skillData = [],skillIds=[], troopPartStats = [] }) => {
  skillData = skillData.map(e => e.toLowerCase());
  let nums = Array.from(range(dataset.from, dataset.to, 1));
  dataset.ignoreNum.forEach((e) => {
    nums = removeItemOnce(nums, e);
  });
  const fieldName = dataset.fieldName;
  const fieldChar = dataset.fieldCharacter;
  let data = [];
  let filedata = []

  nums.forEach((num, i) => {
    let obj = {}
    let code = "";
    const rows = fieldChar
      .map((char, index) => {
        const cell = char + num;
        let cellData = sheet.getCellByA1(cell).value;

        if (fieldName[index] == "rarity") {
          cellData = findIndex(RarityType, cellData);
        } else if (fieldName[index].indexOf("_skill") > 0) {
          return formatValue(skillIds[findIndex(skillData, cellData.toLowerCase())]);
        }
        cellData = formatValue(cellData);
        if (fieldName[index] === "code") {
          code = cellData
        }
        return cellData
      })
      .join(",");

    let partStats = troopPartStats.find((t) => t.code === code);
    let data = [i + 1, ...rows.split(",").map(e => formatValue(e)), '2021-11-14 14:30:35', '2021-11-14 14:30:35', 0, JSON.stringify(partStats.data)]

    let fieldsData = fields.split(",")

    fieldsData.forEach((field, idx) => {
      field = field.replace(" ", "")
      if (field === "part_stat") {
        obj[field] = JSON.parse(data[idx]);
      } else
        obj[field] = data[idx];
    })
    filedata.push(obj);
    detail && data.push(sheet.getCellByA1(detail + num).value);
  });

  return { filedata, data };
};

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
  generateInsertData,
  generateSkillData,
  generateTroopPartStat,
  getListNumber,
  generateArrayTwoLayer
};
