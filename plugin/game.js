const { GoogleSpreadsheet } = require("google-spreadsheet");
const {
  writeFile,
  generateInsertData,
  generateSkillData,
  generateTroopPartStat,
  getListNumber,
  generateArrayTwoLayer,
  range,
} = require("./utils");

const doc = new GoogleSpreadsheet(
  "1EcJJznJLRohrM8CBJu21vTc1q8xemvboIm-EhZHjPXk"
);

const Skill = {
  fieldCharacter: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "AA",
  ],
  fieldName: [
    "code",
    "name",
    "description",
    "rarity",
    "dmg",
    "ed",
    "edu",
    "eng",
    "ct",
    "cd",
    "trg",
    "aoe",
    "eff",
    "er",
    "speed",
    "rng",
    "turn_loop",
    "weight",
    "weight_celest",
    "weight_chaos",
    "weight_boss",
    "alive",
    "target_group",
    "et",
    "is_elite",
    "is_projectile",
  ],
  from: 2,
  to: 171,
  idField: "AB",
  ignoreNum: [45],
};

// theem cot o ban skill nho check lai cai field Z
const CodeName = {
  fieldCharacter: "Z",
  idCharacter: "AB",
  from: 2,
  to: 171,
  ignoreNum: [45],
};

const Troop = {
  fieldCharacter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L"],
  fieldName: [
    "code",
    "name",
    "description",
    "rarity",
    "hp",
    "std",
    "mag",
    "agr",
    "basic_skill",
    "ultimate_skill",
  ],
  from: 2,
  to: 46,
  ignoreNum: [],
};

const TroopPartStat = {
  fieldCharacter: [
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  id: "A",
  from: 4,
  to: 48,
  ignoreNum: [],
};
let listSkill = [];
let listConditions = [];

async function test() {
  await doc.useServiceAccountAuth({
    client_email: "thuan-490@praxis-granite-331006.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxrnBXGZXdgbiy\nykqwZ9XTwqjGSnDq2F0Xkr9WnDu81EiC6YCTu2YB99snURfgP7X5YVdtvhgSbxdE\nJuQcwc275RYoT4UHY/LW5mQJmbOKuVA7mrwWR/6oX/XxT7BGEaeXwGm7NRN5aoyZ\nKoAtJmf3eDaDWAz9eN6wGT4mcV09Q+ZWQliVrJqY4O1I7tQv2DvtiDdBy6YNZ005\nzB1m26HwHL6LdXK2dnS71VEqPoATwd7qAjTb1fYHFdfDp6Mek5a0CPpnmRzSVWVI\nldlmIDTHlDkihix2Xcddm9PEueFkSedhTCarZliVoYtZm11LJeDmL/Yu//rXLzw+\n2rl5aXU1AgMBAAECggEAD/zbPOsfcgv/G49aQx9EvUYxu43tNSR80+cvclKiiW4s\njCMIn8Jn/ltYC+SfGl2BOUxJ+qT1M4ttc4NwWSoTIgoOAViOZsjWjAG1FKwQ3LWq\nA4L706Fsx6fC0JDUEqn6A4ybtu2ir/Una4zIdceT6U+W0CC3IoOivgO3dOwUcLOp\n5pZLfYA5xEvvVBeBHf9YuiZiJkgCUXH8pfNitbVjtmPJsHFa6swmnHgtDrZ6QY//\nQwOz7QvTg1CnRqMmE48YqIPStHChMhnDHLeCHqawtk6NWAHjm2tQrzl8eecAFNL0\njA2EwpHeDvZPTysLpQ6Z9EyDQI9KyLuFyE2elXw7bQKBgQDlBLEYTun4kx747XIg\nJHrRM2s5Po5O8xH9xHwmaGP1eZoH2TkQffcEoF3S8HuCnSaLodDaDQJ/c5m/lX10\ntJ/2/SpLdIeNHuvRCgdl2yiTWu4L6nAa1ixk/bDfVpNOoMTvNdCyIdtbuczsSIT7\nMM+jpauIuRHlqD9Ivcz7wsVstwKBgQDGnWZFGp9qCrgz/4EqaCjQSg/0pnYj8aSe\nsAwVVbiZgGMFAFT7i3+YBPH6hMwx3BfAYChe/IGQZmp8qpCaN+PmO23NiyBAGFjQ\nFq1pP08Awc/S5eW5h5TsW5G2gg5ZpCynSwozofTisFDavMQgMvvxJ8CSkx9iPQhp\nxAVS9YJZcwKBgBWUFpeiv9rjCdUMkmdC6KuTe7PeGAyKTJSrkcMQrPJxLbk1l3Hd\nXIv8DDsW25xX8EzRx1r0RNr7am4pyLNZXYUpH3YSmb8LPc7pcf7/4lfYBnvq7/sn\nWPF/Ec5JWwHalhOv72UJWaDP5eYRgy4j0DysHHh6b5xC+QuCjrDeDjoLAoGAIsRK\nsq4GWbmmpPOE2LeC7XMJd/nrlD8oYd7PPqzSs4wVyTpVpfK1UxcKhJ/aXp/4SGSM\nrJPm2jATU99HkLdX3WVpwyEndBDO+x39HP9IBQnoJzK3E9L37qfYyenaOTbT2jT4\nhDFFfKkAfkmsyzYhhAVBYGcAh2HHpzv48pynRKECgYAPZ1v6SKWys9udDKk2NZ5h\ne+Rk/pDh0GjSDQ0U/NiYRenHUvNMta0V2SkeiyIlHtkRMvlDxEZEIqllFlN8FJZ5\nOyrztWy5M1BZ5EfpJvY8ZrZMzhABBcHKhfKUT9E4k8cXiar/vM8PTfjrHRUMarx6\nT7agFvjYKI4fEXknd46MhA==\n-----END PRIVATE KEY-----\n",
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]; // Basic_skill
  await sheet.loadCells("A1:AB200");
  const sheet1 = doc.sheetsByIndex[1]; // Troop
  await sheet1.loadCells("A1:Z150");
  const sheet2 = doc.sheetsByIndex[2]; // Troop_part_stat
  await sheet2.loadCells("A1:Z99");

  const skill = generateSkillData({
    tableName: "skill",
    dataset: Skill,
    sheet: sheet,
    detail: "A",
    fields:
      "id, code, name, description, rarity, dmg, ed, edu, eng, ct, cd, trg, aoe, eff, er, speed, type, rng, turn_loop, weight, weight_celest, weight_chaos, weight_boss, alive, target_group, et, is_elite, is_projectile, created_at, updated_at, version",
  });

  const name = getListNumber({
    from: CodeName.from,
    to: CodeName.to,
    ignoreNumbers: CodeName.ignoreNum,
  }).map((index) => {
    const cell = CodeName.fieldCharacter + index;
    return sheet.getCellByA1(cell).value;
  });

  const ids = getListNumber({
    from: CodeName.from,
    to: CodeName.to,
    ignoreNumbers: CodeName.ignoreNum,
  }).map((index) => {
    const cell = CodeName.idCharacter + index;
    return sheet.getCellByA1(cell).value;
  });

  const troopPartStats = generateTroopPartStat({
    sheet: sheet2,
    dataset: TroopPartStat,
    rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
    race: ["Beast", "Mystic", "Tectos", "Celest", "Chaos"],
  });
  const troop = generateInsertData({
    tableName: "troop",
    dataset: Troop,
    sheet: sheet1,
    skillData: name,
    skillIds: ids,
    troopPartStats: troopPartStats,
    fields:
      "id, " +
      Troop.fieldName.join(", ") +
      ", created_at, updated_at, version, part_stat",
  });
  listSkill = skill.filedata.map((skill) => skill.code);
  await writeFile("./troop.json", JSON.stringify(troop.filedata));
  await writeFile("./skill.json", JSON.stringify(skill.filedata));
}

async function bossConditions() {
  const Conditions = {
    fieldCharacter: ["B", "D", "E"],
    from: 2,
    to: 68,
  };

  await doc.useServiceAccountAuth({
    client_email: "thuan-490@praxis-granite-331006.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxrnBXGZXdgbiy\nykqwZ9XTwqjGSnDq2F0Xkr9WnDu81EiC6YCTu2YB99snURfgP7X5YVdtvhgSbxdE\nJuQcwc275RYoT4UHY/LW5mQJmbOKuVA7mrwWR/6oX/XxT7BGEaeXwGm7NRN5aoyZ\nKoAtJmf3eDaDWAz9eN6wGT4mcV09Q+ZWQliVrJqY4O1I7tQv2DvtiDdBy6YNZ005\nzB1m26HwHL6LdXK2dnS71VEqPoATwd7qAjTb1fYHFdfDp6Mek5a0CPpnmRzSVWVI\nldlmIDTHlDkihix2Xcddm9PEueFkSedhTCarZliVoYtZm11LJeDmL/Yu//rXLzw+\n2rl5aXU1AgMBAAECggEAD/zbPOsfcgv/G49aQx9EvUYxu43tNSR80+cvclKiiW4s\njCMIn8Jn/ltYC+SfGl2BOUxJ+qT1M4ttc4NwWSoTIgoOAViOZsjWjAG1FKwQ3LWq\nA4L706Fsx6fC0JDUEqn6A4ybtu2ir/Una4zIdceT6U+W0CC3IoOivgO3dOwUcLOp\n5pZLfYA5xEvvVBeBHf9YuiZiJkgCUXH8pfNitbVjtmPJsHFa6swmnHgtDrZ6QY//\nQwOz7QvTg1CnRqMmE48YqIPStHChMhnDHLeCHqawtk6NWAHjm2tQrzl8eecAFNL0\njA2EwpHeDvZPTysLpQ6Z9EyDQI9KyLuFyE2elXw7bQKBgQDlBLEYTun4kx747XIg\nJHrRM2s5Po5O8xH9xHwmaGP1eZoH2TkQffcEoF3S8HuCnSaLodDaDQJ/c5m/lX10\ntJ/2/SpLdIeNHuvRCgdl2yiTWu4L6nAa1ixk/bDfVpNOoMTvNdCyIdtbuczsSIT7\nMM+jpauIuRHlqD9Ivcz7wsVstwKBgQDGnWZFGp9qCrgz/4EqaCjQSg/0pnYj8aSe\nsAwVVbiZgGMFAFT7i3+YBPH6hMwx3BfAYChe/IGQZmp8qpCaN+PmO23NiyBAGFjQ\nFq1pP08Awc/S5eW5h5TsW5G2gg5ZpCynSwozofTisFDavMQgMvvxJ8CSkx9iPQhp\nxAVS9YJZcwKBgBWUFpeiv9rjCdUMkmdC6KuTe7PeGAyKTJSrkcMQrPJxLbk1l3Hd\nXIv8DDsW25xX8EzRx1r0RNr7am4pyLNZXYUpH3YSmb8LPc7pcf7/4lfYBnvq7/sn\nWPF/Ec5JWwHalhOv72UJWaDP5eYRgy4j0DysHHh6b5xC+QuCjrDeDjoLAoGAIsRK\nsq4GWbmmpPOE2LeC7XMJd/nrlD8oYd7PPqzSs4wVyTpVpfK1UxcKhJ/aXp/4SGSM\nrJPm2jATU99HkLdX3WVpwyEndBDO+x39HP9IBQnoJzK3E9L37qfYyenaOTbT2jT4\nhDFFfKkAfkmsyzYhhAVBYGcAh2HHpzv48pynRKECgYAPZ1v6SKWys9udDKk2NZ5h\ne+Rk/pDh0GjSDQ0U/NiYRenHUvNMta0V2SkeiyIlHtkRMvlDxEZEIqllFlN8FJZ5\nOyrztWy5M1BZ5EfpJvY8ZrZMzhABBcHKhfKUT9E4k8cXiar/vM8PTfjrHRUMarx6\nT7agFvjYKI4fEXknd46MhA==\n-----END PRIVATE KEY-----\n",
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["boss_challenge_condition_list"]; // boss_challenge_condition_list
  await sheet.loadCells("A1:Z99");

  let conditions = generateArrayTwoLayer({
    sheet,
    dataset: {
      ...Conditions,
      fieldNumber: Array.from(range(Conditions.from, Conditions.to, 1)),
    },
  });

  let filedata = `INSERT into boss_condition 
  (condition_id, type, config, created_at, updated_at) values \n`;
  conditions.forEach((condition) => {
    const cond = condition;
    listConditions.push(cond[0]);
    filedata += `('${cond[0]}',${cond[1]},'${cond[2]}',  '2021-11-14 14:30:35', '2021-11-14 14:30:35'),\n`;
  });

  await writeFile("./boss-condition.sql", filedata);
  // await writeFile("./skill.sql", skill.filedata);
}

async function boss() {
  const Boss = {
    fieldCharacter: [],
    from: 1,
    to: 7,
  };

  for (let index = 0; index < 83; index++) {
    let key = "";
    if (index < 26) {
      key = String.fromCharCode(65 + index);
    } else {
      key = `${String.fromCharCode(
        Math.floor(index / 26) + 64
      )}${String.fromCharCode(65 + (index % 26))}`;
    }
    Boss.fieldCharacter.push(key);
  }

  await doc.useServiceAccountAuth({
    client_email: "thuan-490@praxis-granite-331006.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxrnBXGZXdgbiy\nykqwZ9XTwqjGSnDq2F0Xkr9WnDu81EiC6YCTu2YB99snURfgP7X5YVdtvhgSbxdE\nJuQcwc275RYoT4UHY/LW5mQJmbOKuVA7mrwWR/6oX/XxT7BGEaeXwGm7NRN5aoyZ\nKoAtJmf3eDaDWAz9eN6wGT4mcV09Q+ZWQliVrJqY4O1I7tQv2DvtiDdBy6YNZ005\nzB1m26HwHL6LdXK2dnS71VEqPoATwd7qAjTb1fYHFdfDp6Mek5a0CPpnmRzSVWVI\nldlmIDTHlDkihix2Xcddm9PEueFkSedhTCarZliVoYtZm11LJeDmL/Yu//rXLzw+\n2rl5aXU1AgMBAAECggEAD/zbPOsfcgv/G49aQx9EvUYxu43tNSR80+cvclKiiW4s\njCMIn8Jn/ltYC+SfGl2BOUxJ+qT1M4ttc4NwWSoTIgoOAViOZsjWjAG1FKwQ3LWq\nA4L706Fsx6fC0JDUEqn6A4ybtu2ir/Una4zIdceT6U+W0CC3IoOivgO3dOwUcLOp\n5pZLfYA5xEvvVBeBHf9YuiZiJkgCUXH8pfNitbVjtmPJsHFa6swmnHgtDrZ6QY//\nQwOz7QvTg1CnRqMmE48YqIPStHChMhnDHLeCHqawtk6NWAHjm2tQrzl8eecAFNL0\njA2EwpHeDvZPTysLpQ6Z9EyDQI9KyLuFyE2elXw7bQKBgQDlBLEYTun4kx747XIg\nJHrRM2s5Po5O8xH9xHwmaGP1eZoH2TkQffcEoF3S8HuCnSaLodDaDQJ/c5m/lX10\ntJ/2/SpLdIeNHuvRCgdl2yiTWu4L6nAa1ixk/bDfVpNOoMTvNdCyIdtbuczsSIT7\nMM+jpauIuRHlqD9Ivcz7wsVstwKBgQDGnWZFGp9qCrgz/4EqaCjQSg/0pnYj8aSe\nsAwVVbiZgGMFAFT7i3+YBPH6hMwx3BfAYChe/IGQZmp8qpCaN+PmO23NiyBAGFjQ\nFq1pP08Awc/S5eW5h5TsW5G2gg5ZpCynSwozofTisFDavMQgMvvxJ8CSkx9iPQhp\nxAVS9YJZcwKBgBWUFpeiv9rjCdUMkmdC6KuTe7PeGAyKTJSrkcMQrPJxLbk1l3Hd\nXIv8DDsW25xX8EzRx1r0RNr7am4pyLNZXYUpH3YSmb8LPc7pcf7/4lfYBnvq7/sn\nWPF/Ec5JWwHalhOv72UJWaDP5eYRgy4j0DysHHh6b5xC+QuCjrDeDjoLAoGAIsRK\nsq4GWbmmpPOE2LeC7XMJd/nrlD8oYd7PPqzSs4wVyTpVpfK1UxcKhJ/aXp/4SGSM\nrJPm2jATU99HkLdX3WVpwyEndBDO+x39HP9IBQnoJzK3E9L37qfYyenaOTbT2jT4\nhDFFfKkAfkmsyzYhhAVBYGcAh2HHpzv48pynRKECgYAPZ1v6SKWys9udDKk2NZ5h\ne+Rk/pDh0GjSDQ0U/NiYRenHUvNMta0V2SkeiyIlHtkRMvlDxEZEIqllFlN8FJZ5\nOyrztWy5M1BZ5EfpJvY8ZrZMzhABBcHKhfKUT9E4k8cXiar/vM8PTfjrHRUMarx6\nT7agFvjYKI4fEXknd46MhA==\n-----END PRIVATE KEY-----\n",
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["boss"]; // boss_challenge_condition_list
  await sheet.loadCells("A1:CF99");

  let boss = generateArrayTwoLayer({
    sheet,
    dataset: {
      ...Boss,
      fieldNumber: Array.from(range(Boss.from, Boss.to, 1)),
    },
  });

  let filedata = `INSERT into boss 
  (race, conditions, milestones, created_at, updated_at) values \n`;
  const label = boss[0];
  const milestonesLabel = [
    "BS",
    "US",
    "Milestone",
    "Lv",
    "Evo",
    "STD",
    "MA",
    "AGR",
    "Multi",
    "DMG_bonus",
    "ENGx",
  ];
  const milestonesKey = [
    "bs",
    "utl",
    "milestone",
    "lv",
    "evo",
    "std",
    "ma",
    "agr",
    "multi",
    "dmg_bonus",
    "eng",
  ];
  const listRace = ["Beast", "Tectos", "Mystic", "Celest", "Chaos", "All"];
  for (let i = 1; i < boss.length; i++) {
    const bossData = boss[i];
    let milestones = [];
    for (let j = 1; j < 7; j++) {
      const data = {};
      milestonesLabel.forEach((e, index) => {
        if (e == "BS" || e == "US") {
          value = listSkill.indexOf(bossData[label.indexOf(`${e}_${j}`)]) + 1;
          data[milestonesKey[index]] = value;
        } else if (e === "Milestone") {
          const milestone = bossData[label.indexOf(`${e}_${j}`)]
            ? bossData[label.indexOf(`${e}_${j}`)].replace(",", "")
            : "";
          data[milestonesKey[index]] = milestone ? parseInt(milestone) : 0;
        } else
          data[milestonesKey[index]] = parseInt(
            bossData[label.indexOf(`${e}_${j}`)]
          );
      });
      milestones.push(data);
    }
    const conditions = [bossData[2], bossData[3], bossData[4]];
    filedata += `('${listRace.indexOf(bossData[5])}','${JSON.stringify(
      conditions.map((cond) => listConditions.indexOf(cond) + 1)
    )}','${JSON.stringify(
      milestones
    )}', '2021-11-14 14:30:35', '2021-11-14 14:30:35'),\n`;
  }
  await writeFile("./boss.sql", filedata);
  // console.log(label);
}

async function abyssStage() {
  const Boss = {
    fieldCharacter: [],
    from: 1,
    to: 61,
  };
  const Rewards = {
    fieldCharacter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    from: 1,
    to: 61,
  };

  for (let index = 0; index < 36; index++) {
    let key = "";
    if (index < 26) {
      key = String.fromCharCode(65 + index);
    } else {
      key = `${String.fromCharCode(
        Math.floor(index / 26) + 64
      )}${String.fromCharCode(65 + (index % 26))}`;
    }
    Boss.fieldCharacter.push(key);
  }

  const doc = new GoogleSpreadsheet(
    "15Mwzv9UAWDZFr2E2Bw9TcFshnaviZ2dRElF5tiR67xk"
  );
  await doc.useServiceAccountAuth({
    client_email: "thuan-490@praxis-granite-331006.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxrnBXGZXdgbiy\nykqwZ9XTwqjGSnDq2F0Xkr9WnDu81EiC6YCTu2YB99snURfgP7X5YVdtvhgSbxdE\nJuQcwc275RYoT4UHY/LW5mQJmbOKuVA7mrwWR/6oX/XxT7BGEaeXwGm7NRN5aoyZ\nKoAtJmf3eDaDWAz9eN6wGT4mcV09Q+ZWQliVrJqY4O1I7tQv2DvtiDdBy6YNZ005\nzB1m26HwHL6LdXK2dnS71VEqPoATwd7qAjTb1fYHFdfDp6Mek5a0CPpnmRzSVWVI\nldlmIDTHlDkihix2Xcddm9PEueFkSedhTCarZliVoYtZm11LJeDmL/Yu//rXLzw+\n2rl5aXU1AgMBAAECggEAD/zbPOsfcgv/G49aQx9EvUYxu43tNSR80+cvclKiiW4s\njCMIn8Jn/ltYC+SfGl2BOUxJ+qT1M4ttc4NwWSoTIgoOAViOZsjWjAG1FKwQ3LWq\nA4L706Fsx6fC0JDUEqn6A4ybtu2ir/Una4zIdceT6U+W0CC3IoOivgO3dOwUcLOp\n5pZLfYA5xEvvVBeBHf9YuiZiJkgCUXH8pfNitbVjtmPJsHFa6swmnHgtDrZ6QY//\nQwOz7QvTg1CnRqMmE48YqIPStHChMhnDHLeCHqawtk6NWAHjm2tQrzl8eecAFNL0\njA2EwpHeDvZPTysLpQ6Z9EyDQI9KyLuFyE2elXw7bQKBgQDlBLEYTun4kx747XIg\nJHrRM2s5Po5O8xH9xHwmaGP1eZoH2TkQffcEoF3S8HuCnSaLodDaDQJ/c5m/lX10\ntJ/2/SpLdIeNHuvRCgdl2yiTWu4L6nAa1ixk/bDfVpNOoMTvNdCyIdtbuczsSIT7\nMM+jpauIuRHlqD9Ivcz7wsVstwKBgQDGnWZFGp9qCrgz/4EqaCjQSg/0pnYj8aSe\nsAwVVbiZgGMFAFT7i3+YBPH6hMwx3BfAYChe/IGQZmp8qpCaN+PmO23NiyBAGFjQ\nFq1pP08Awc/S5eW5h5TsW5G2gg5ZpCynSwozofTisFDavMQgMvvxJ8CSkx9iPQhp\nxAVS9YJZcwKBgBWUFpeiv9rjCdUMkmdC6KuTe7PeGAyKTJSrkcMQrPJxLbk1l3Hd\nXIv8DDsW25xX8EzRx1r0RNr7am4pyLNZXYUpH3YSmb8LPc7pcf7/4lfYBnvq7/sn\nWPF/Ec5JWwHalhOv72UJWaDP5eYRgy4j0DysHHh6b5xC+QuCjrDeDjoLAoGAIsRK\nsq4GWbmmpPOE2LeC7XMJd/nrlD8oYd7PPqzSs4wVyTpVpfK1UxcKhJ/aXp/4SGSM\nrJPm2jATU99HkLdX3WVpwyEndBDO+x39HP9IBQnoJzK3E9L37qfYyenaOTbT2jT4\nhDFFfKkAfkmsyzYhhAVBYGcAh2HHpzv48pynRKECgYAPZ1v6SKWys9udDKk2NZ5h\ne+Rk/pDh0GjSDQ0U/NiYRenHUvNMta0V2SkeiyIlHtkRMvlDxEZEIqllFlN8FJZ5\nOyrztWy5M1BZ5EfpJvY8ZrZMzhABBcHKhfKUT9E4k8cXiar/vM8PTfjrHRUMarx6\nT7agFvjYKI4fEXknd46MhA==\n-----END PRIVATE KEY-----\n",
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["abyss_stage"]; // boss_challenge_condition_list
  await sheet.loadCells("A1:AJ99");
  const sheet1 = doc.sheetsByTitle["abyss_stage_reward"]; // boss_challenge_condition_list
  await sheet1.loadCells("A1:AJ99");

  let boss = generateArrayTwoLayer({
    sheet,
    dataset: {
      ...Boss,
      fieldNumber: Array.from(range(Boss.from, Boss.to, 1)),
    },
  });
  let rewards = generateArrayTwoLayer({
    sheet: sheet1,
    dataset: {
      ...Rewards,
      fieldNumber: Array.from(range(Rewards.from, Rewards.to, 1)),
    },
  });

  const label = boss[0];
  const milestonesLabel = [
    "BS",
    "US",
    "Milestone",
    "Lv",
    "Evo",
    "STD",
    "MA",
    "AGR",
    "Multi",
    "DMG_bonus",
    "ENGx",
  ];
  const milestonesKey = [
    "bs",
    "utl",
    "milestone",
    "lv",
    "evo",
    "std",
    "ma",
    "agr",
    "multi",
    "dmg_bonus",
    "eng",
  ];
  const abyssPool = [
    {
      name: "uncommon farm bundle",
      type: "farm_landplot_A",
      id: 77,
    },
    {
      name: "uncommon habitat bundle",
      type: "mongen_habitat_A",
      id: 78,
    },
    {
      name: "rare farm bundle",
      type: "farm_landplot_B",
      id: 79,
    },
    {
      name: "rare habitat bundle",
      type: "mongen_habitat_B",
      id: 80,
    },
    {
      name: "epic farm bundle",
      type: "farm_landplot_C",
      id: 81,
    },
    {
      name: "epic habitat bundle",
      type: "mongen_habitat_C",
      id: 82,
    },
  ];
  const listRace = ["Beast", "Tectos", "Mystic", "Celest", "Chaos", "All"];
  let dataStage = [];
  for (let i = 1; i < boss.length; i++) {
    const bossData = boss[i];
    let milestones = [];
    for (let j = 1; j < 4; j++) {
      const data = {};
      milestonesLabel.forEach((e, index) => {
        if (e == "BS" || e == "US") {
          value = listSkill.indexOf(bossData[label.indexOf(`${e}_${j}`)]) + 1;
          data[milestonesKey[index]] = value;
        } else if (e === "Milestone") {
          const milestone = bossData[label.indexOf(`${e}_${j}`)]
            ? bossData[label.indexOf(`${e}_${j}`)].toString().replace(",", "")
            : "";
          data[milestonesKey[index]] = milestone ? parseInt(milestone) : 0;
        } else
          data[milestonesKey[index]] = parseInt(
            bossData[label.indexOf(`${e}_${j}`)]
          );
        if (!data.multi) {
          data.multi = 1;
        }
      });
      milestones.push(data);
    }
    const conditions = [bossData[2], bossData[3], bossData[4]];
    let rewardData = rewards.find(reward => reward[0] == i);
    let rewardList = [];
    let box_name = null;
    let box_type = null;
    let reward_pool_id = null;
    for(let i = 0; i < 3; i++) {
      let rewardType = 7;
      if(rewardData[i * 3 + 1] == "Bonus Star") {
        rewardType = 41;
      }
      if(rewardData[i * 3 + 1] == "sMAG") {
        rewardType = 2;
      }
      if(rewardType == 7) {
        let text = rewardData[i * 3 + 1].toLowerCase();
        const pool = abyssPool.find(p => p.name == text);
        if(pool) {
          box_name = pool.type;
          box_type = pool.type;
          reward_pool_id = pool.id;
        }
      }
      const quant = rewardData[i * 3 + 2];
      const isPremium =rewardData[i * 3 + 3];
      let data = {
        reward_type: rewardType,
        reward_quantity: quant,
        is_high_fee: false,
        box_name,
        box_type,
        reward_pool_id,
      };
      if(!data.reward_pool_id) delete data.reward_pool_id
      rewardList.push({
        rewards_list: [data],
        isPremium
      })
    }
    dataStage.push({
      id: i,
      model: bossData[1],
      race: listRace.indexOf(bossData[5]),
      conditions: conditions.map((cond) => listConditions.indexOf(cond) + 1),
      milestones,
      rewards: rewardList,
    });
  }
  await writeFile("./abyss-stage.json", JSON.stringify(dataStage));
  // console.log(label);
}

async function generate() {
  await test();
  await bossConditions();
  await boss();
  await abyssStage();
}
generate();
