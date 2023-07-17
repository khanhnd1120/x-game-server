const {
    writeFile,
} = require("./utils");
const breeding = require("../admin/breeding_id_part.json");
const modelOrigin = require("../admin/model.json");

const modalNames = { ...modelOrigin }

let races = ['beast', 'tectos', 'mystic', 'celest', 'chaos'];
let rarities = ['D', 'C', 'B', 'A', "S"]

const syncModal = async () => {
    Object.keys(modalNames).map((key) => {
        let splits = key.split("_");
        let race = races.indexOf(splits[0].toLowerCase());
        if (race < 0) {
            return null;
        }
        let rarity = rarities.indexOf(splits[1]);
        let idPart = Number(splits[2]);
        let mouthId = Number(splits[3]);
        let dna = randomPurenessDNA(key, race, rarity, idPart, mouthId);
        modalNames[key] = dna;
    })
    await writeFile("./model.json", JSON.stringify(modalNames));
}

const BodyPart = {
    Form: 0,
    Head: 1,
    Eyes: 2,
    Horns: 3,
    Tail: 4,
    Back: 5,
    FrontLeg: 6,
    BackLeg: 7,
    Mouth: 8,
    Aura: 9,
}

const MaxBodyPart = [
    // statsList: Form - Head - Eyes - Horns - Tails - Back - Frontleg - Backleg - Mouth
    [
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
    ],
    [
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
    ],
    [
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
    ],
    [
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
    ],
    [
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
    ],
    [
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
    ],
    [
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
    ],
    [
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
        [4, 4, 3, 2, 2],
    ],
    [
        [65, 65, 65, 65, 65],
        [65, 65, 65, 65, 65],
        [65, 65, 65, 65, 65],
        [65, 65, 65, 65, 65],
        [65, 65, 65, 65, 65],
    ],
];

function* range(start, end, step) {
    while (start <= end) {
        yield start;
        start += step;
    }
}

function randomPurenessDNA(
    key,
    form_race,
    rarity = 0,
    base_id,
    mouth_id
) {
    let dna = [];
    let bodyParts = [
        BodyPart.Form,
        BodyPart.Head,
        BodyPart.Eyes,
        BodyPart.Horns,
        BodyPart.Tail,
        BodyPart.Back,
        BodyPart.FrontLeg,
        BodyPart.BackLeg,
        BodyPart.Mouth,
    ];
    dna = bodyParts.map((part) => {
        let id = base_id;
        let race = form_race;
        let availableIds = Array.from(range(1, MaxBodyPart[part][race][rarity], 1));
        availableIds = availableIds.filter((id) => {
            return canBeAncester(part, rarity, id) || canInherit(part, rarity, id);
        })

        if (!availableIds.includes(id)) {
            console.log("Cannot have this id", key, { bodyPart: part, rarity, id });
            id = getRandomInArray(availableIds);
        }

        if (part === BodyPart.Mouth) {
            id = mouth_id;
        }
        return [form_race, rarity, id];
    });

    dna.push([rarity]);
    return dna;
}

function canBeAncester(
    part,
    rarity,
    id
) {
    if (part === BodyPart.Mouth || part === BodyPart.Aura) {
        return true;
    }
    return breeding[part][rarity][id].ancestor;
}
function canInherit(part, rarity, id) {
    if (part === BodyPart.Mouth || part === BodyPart.Aura) {
        return true;
    }
    return breeding[part][rarity][id].inheritable;
}


const getRandomInArray = (items) => {
    let item = items[Math.floor(Math.random() * items.length)];
    return item;
};


syncModal();