const { GoogleSpreadsheet } = require("google-spreadsheet");
const {
  writeFile,
  generateArrayTwoLayer,
  range,
} = require("./utils");

const doc = new GoogleSpreadsheet(
  "1EcJJznJLRohrM8CBJu21vTc1q8xemvboIm-EhZHjPXk"
);

async function test() {
  await doc.useServiceAccountAuth({
    client_email: "thuan-490@praxis-granite-331006.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxrnBXGZXdgbiy\nykqwZ9XTwqjGSnDq2F0Xkr9WnDu81EiC6YCTu2YB99snURfgP7X5YVdtvhgSbxdE\nJuQcwc275RYoT4UHY/LW5mQJmbOKuVA7mrwWR/6oX/XxT7BGEaeXwGm7NRN5aoyZ\nKoAtJmf3eDaDWAz9eN6wGT4mcV09Q+ZWQliVrJqY4O1I7tQv2DvtiDdBy6YNZ005\nzB1m26HwHL6LdXK2dnS71VEqPoATwd7qAjTb1fYHFdfDp6Mek5a0CPpnmRzSVWVI\nldlmIDTHlDkihix2Xcddm9PEueFkSedhTCarZliVoYtZm11LJeDmL/Yu//rXLzw+\n2rl5aXU1AgMBAAECggEAD/zbPOsfcgv/G49aQx9EvUYxu43tNSR80+cvclKiiW4s\njCMIn8Jn/ltYC+SfGl2BOUxJ+qT1M4ttc4NwWSoTIgoOAViOZsjWjAG1FKwQ3LWq\nA4L706Fsx6fC0JDUEqn6A4ybtu2ir/Una4zIdceT6U+W0CC3IoOivgO3dOwUcLOp\n5pZLfYA5xEvvVBeBHf9YuiZiJkgCUXH8pfNitbVjtmPJsHFa6swmnHgtDrZ6QY//\nQwOz7QvTg1CnRqMmE48YqIPStHChMhnDHLeCHqawtk6NWAHjm2tQrzl8eecAFNL0\njA2EwpHeDvZPTysLpQ6Z9EyDQI9KyLuFyE2elXw7bQKBgQDlBLEYTun4kx747XIg\nJHrRM2s5Po5O8xH9xHwmaGP1eZoH2TkQffcEoF3S8HuCnSaLodDaDQJ/c5m/lX10\ntJ/2/SpLdIeNHuvRCgdl2yiTWu4L6nAa1ixk/bDfVpNOoMTvNdCyIdtbuczsSIT7\nMM+jpauIuRHlqD9Ivcz7wsVstwKBgQDGnWZFGp9qCrgz/4EqaCjQSg/0pnYj8aSe\nsAwVVbiZgGMFAFT7i3+YBPH6hMwx3BfAYChe/IGQZmp8qpCaN+PmO23NiyBAGFjQ\nFq1pP08Awc/S5eW5h5TsW5G2gg5ZpCynSwozofTisFDavMQgMvvxJ8CSkx9iPQhp\nxAVS9YJZcwKBgBWUFpeiv9rjCdUMkmdC6KuTe7PeGAyKTJSrkcMQrPJxLbk1l3Hd\nXIv8DDsW25xX8EzRx1r0RNr7am4pyLNZXYUpH3YSmb8LPc7pcf7/4lfYBnvq7/sn\nWPF/Ec5JWwHalhOv72UJWaDP5eYRgy4j0DysHHh6b5xC+QuCjrDeDjoLAoGAIsRK\nsq4GWbmmpPOE2LeC7XMJd/nrlD8oYd7PPqzSs4wVyTpVpfK1UxcKhJ/aXp/4SGSM\nrJPm2jATU99HkLdX3WVpwyEndBDO+x39HP9IBQnoJzK3E9L37qfYyenaOTbT2jT4\nhDFFfKkAfkmsyzYhhAVBYGcAh2HHpzv48pynRKECgYAPZ1v6SKWys9udDKk2NZ5h\ne+Rk/pDh0GjSDQ0U/NiYRenHUvNMta0V2SkeiyIlHtkRMvlDxEZEIqllFlN8FJZ5\nOyrztWy5M1BZ5EfpJvY8ZrZMzhABBcHKhfKUT9E4k8cXiar/vM8PTfjrHRUMarx6\nT7agFvjYKI4fEXknd46MhA==\n-----END PRIVATE KEY-----\n",
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]; // Basic_skill
  await sheet.loadCells("A1:AB200");
}

async function generate() {
  await test();
}
generate();
