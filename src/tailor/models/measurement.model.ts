export type DressType =
    | "shirt"
    | "kameez"
    | "kurta"
    | "waistcoat"
    | "coat"
    | "sherwani"
    | "trouser"
    | "shalwar"
    | "pajama"
    | "suit"
    | "shalwar_kameez"
    | "ladies_suit"
    | "blouse"
    | "frock";

export type MeasurementField =
    | "length"
    | "shoulder"
    | "chest"
    | "waist"
    | "hip"
    | "neck"
    | "armLength"
    | "armRound"
    | "bicep"
    | "elbow"
    | "wrist"
    | "armOpening"
    | "trouserLength"
    | "inseam"
    | "rise"
    | "thigh"
    | "knee"
    | "calf"
    | "ankle"
    | "bottom"
    | "underBust"
    | "bust"
    | "neckDepthFront"
    | "neckDepthBack"
    | "sidePocket"
    | "frontPocket"
    | "backPocket"
    | "breastPocket"
    | "innerPocket"
    | "patchPocket"
    | "ticketPocket"
    | "elbowPatch"
    | "collarType"
    | "cuffType"
    | "fitType"
    | "trouserType"
    | "lapelStyle"
    | "neckStyle"
    | "armType"
    | "ventType"
    | "waistcoatType"
    | "riseType"
    | "hemType"
    | "frontPocketType"
    | "backPocketType"
    | "height"
    | "weight"
    | "notes";

export interface measurementFormValues {
    id?: string;
    clientId: string;
    type: DressType | "";
    length: number;
    shoulder: number;
    chest: number;
    waist: number;
    hip: number;
    neck: number;
    armLength: number;
    armRound: number;
    bicep: number;
    elbow: number;
    wrist: number;
    armOpening: number;
    trouserLength: number;
    inseam: number;
    rise: number;
    thigh: number;
    knee: number;
    calf: number;
    ankle: number;
    bottom: number;
    underBust: number;
    bust: number;
    neckDepthFront: number;
    neckDepthBack: number;
    sidePocket: boolean;
    frontPocket: boolean;
    backPocket: boolean;
    breastPocket: boolean;
    innerPocket: boolean;
    patchPocket: boolean;
    ticketPocket: boolean;
    elbowPatch: boolean;
    collarType: string;
    cuffType: string;
    fitType: string;
    trouserType: string;
    lapelStyle: string;
    neckStyle: string;
    armType: string;
    ventType: string;
    waistcoatType: string;
    riseType: string;
    hemType: string;
    frontPocketType: string;
    backPocketType: string;
    height: number;
    weight: number;
    notes: string;
}

export const DRESS_TYPE_OPTIONS: { label: string; value: DressType }[] = [
    { label: "Shirt", value: "shirt" },
    { label: "Kameez", value: "kameez" },
    { label: "Kurta", value: "kurta" },
    { label: "Waistcoat", value: "waistcoat" },
    { label: "Coat / Blazer", value: "coat" },
    { label: "Sherwani", value: "sherwani" },
    { label: "Trouser / Pant", value: "trouser" },
    { label: "Shalwar", value: "shalwar" },
    { label: "Pajama", value: "pajama" },
    { label: "Suit (Coat + Trouser)", value: "suit" },
    { label: "Shalwar Kameez", value: "shalwar_kameez" },
    { label: "Ladies Suit", value: "ladies_suit" },
    { label: "Blouse", value: "blouse" },
    { label: "Frock / Maxi", value: "frock" },
];

const UPPER: MeasurementField[] = [
    "length", "shoulder", "chest", "waist", "hip", "neck",
];

const ARMS: MeasurementField[] = [
    "armLength", "armRound", "bicep", "elbow", "wrist", "armOpening",
];

const TROUSER: MeasurementField[] = [
    "trouserLength", "inseam", "rise", "thigh", "knee", "calf", "ankle", "bottom",
];

const SHALWAR: MeasurementField[] = [
    "trouserLength", "waist", "hip", "thigh", "bottom", "ankle",
];

const WOMEN_UPPER: MeasurementField[] = [
    "bust", "underBust", "waist", "hip", "length", "shoulder",
    "neck", "neckDepthFront", "neckDepthBack",
];

const META: MeasurementField[] = ["height", "weight", "notes"];

/** Fields visible for each Pakistani dress type */
export const DRESS_TYPE_FIELDS: Record<DressType, MeasurementField[]> = {
    shirt: [
        ...UPPER, ...ARMS,
        "collarType", "cuffType", "fitType",
        "breastPocket",
        ...META,
    ],
    kameez: [
        ...UPPER, ...ARMS,
        "neckStyle", "collarType", "cuffType", "fitType",
        "sidePocket", "breastPocket",
        ...META,
    ],
    kurta: [
        ...UPPER, ...ARMS,
        "neckStyle", "collarType", "cuffType", "fitType",
        "sidePocket",
        ...META,
    ],
    waistcoat: [
        "length", "shoulder", "chest", "waist", "hip", "neck",
        "waistcoatType", "fitType",
        "breastPocket",
        ...META,
    ],
    coat: [
        ...UPPER, ...ARMS,
        "lapelStyle", "collarType", "cuffType", "fitType", "armType", "ventType",
        "breastPocket", "innerPocket", "sidePocket", "patchPocket", "elbowPatch",
        ...META,
    ],
    sherwani: [
        ...UPPER, ...ARMS,
        "neckStyle", "collarType", "fitType",
        "sidePocket", "innerPocket",
        ...META,
    ],
    trouser: [
        "waist", "hip",
        ...TROUSER,
        "trouserType", "riseType", "hemType", "fitType",
        "frontPocketType", "backPocketType", "ticketPocket",
        ...META,
    ],
    shalwar: [
        ...SHALWAR,
        "trouserType", "fitType",
        "sidePocket",
        ...META,
    ],
    pajama: [
        "waist", "hip", "trouserLength", "thigh", "bottom", "ankle",
        "trouserType", "fitType",
        ...META,
    ],
    suit: [
        ...UPPER, ...ARMS,
        ...TROUSER,
        "lapelStyle", "collarType", "cuffType", "fitType", "trouserType", "riseType", "hemType", "armType", "ventType",
        "breastPocket", "innerPocket", "sidePocket", "patchPocket", "elbowPatch",
        "frontPocketType", "backPocketType", "ticketPocket",
        ...META,
    ],
    shalwar_kameez: [
        ...UPPER, ...ARMS,
        ...SHALWAR,
        "neckStyle", "collarType", "cuffType", "fitType", "trouserType",
        "sidePocket", "breastPocket",
        ...META,
    ],
    ladies_suit: [
        ...WOMEN_UPPER, ...ARMS,
        ...SHALWAR,
        "neckStyle", "fitType", "trouserType",
        "sidePocket",
        ...META,
    ],
    blouse: [
        ...WOMEN_UPPER, ...ARMS,
        "neckStyle", "fitType",
        ...META,
    ],
    frock: [
        ...WOMEN_UPPER, ...ARMS,
        "neckStyle", "fitType",
        "sidePocket",
        ...META,
    ],
};

export const FIELD_LABELS: Record<MeasurementField, string> = {
    length: "Length",
    shoulder: "Shoulder",
    chest: "Chest",
    waist: "Waist",
    hip: "Hip",
    neck: "Neck",
    armLength: "Arm Length",
    armRound: "Arm Round",
    bicep: "Bicep",
    elbow: "Elbow",
    wrist: "Wrist",
    armOpening: "Arm Opening",
    trouserLength: "Trouser Length",
    inseam: "Inseam",
    rise: "Rise",
    thigh: "Thigh",
    knee: "Knee",
    calf: "Calf",
    ankle: "Ankle",
    bottom: "Bottom / Hem",
    underBust: "Under Bust",
    bust: "Bust",
    neckDepthFront: "Neck Depth (Front)",
    neckDepthBack: "Neck Depth (Back)",
    sidePocket: "Side Pocket",
    frontPocket: "Front Pocket",
    backPocket: "Back Pocket",
    breastPocket: "Breast Pocket",
    innerPocket: "Inner Pocket",
    patchPocket: "Patch Pocket",
    ticketPocket: "Ticket Pocket",
    elbowPatch: "Elbow Patches",
    collarType: "Collar Type",
    cuffType: "Cuff Type",
    fitType: "Fit Type",
    trouserType: "Pant Type",
    lapelStyle: "Lapel Style",
    neckStyle: "Neck Style",
    armType: "Arm Type",
    ventType: "Vent Type",
    waistcoatType: "Waistcoat Type",
    riseType: "Rise Type",
    hemType: "Hem Type",
    frontPocketType: "Front Pocket Type",
    backPocketType: "Back Pocket Type",
    height: "Height",
    weight: "Weight",
    notes: "Notes",
};

export const BOOLEAN_FIELDS: MeasurementField[] = [
    "sidePocket", "frontPocket", "backPocket", "breastPocket", "innerPocket", "patchPocket", "ticketPocket",
];

export const SELECT_FIELDS: MeasurementField[] = [
    "collarType", "cuffType", "fitType", "trouserType", "lapelStyle", "neckStyle",
    "armType", "ventType", "waistcoatType", "riseType", "hemType", "frontPocketType", "backPocketType",
];

const COAT_TYPES = new Set<DressType>(["coat", "suit"]);
const PANT_TYPES = new Set<DressType>(["trouser", "suit"]);
const SHALWAR_LIKE_TYPES = new Set<DressType>(["shalwar", "pajama", "shalwar_kameez", "ladies_suit"]);

export const getSelectOptions = (
    field: string,
    type?: string
): { label: string; value: string }[] => {
    const options = SELECT_OPTIONS[field] ?? [];
    if (field === "collarType" && type && COAT_TYPES.has(type as DressType)) {
        return options.filter((o) => o.value !== "button_down");
    }
    if (field === "trouserType" && type && PANT_TYPES.has(type as DressType)) {
        return options.filter((o) => o.value !== "shalwar_cut");
    }
    if (field === "trouserType" && type && SHALWAR_LIKE_TYPES.has(type as DressType)) {
        return options.filter((o) => o.value !== "bootcut" && o.value !== "bell_bottom");
    }
    return options;
};

export const TEXT_FIELDS: MeasurementField[] = ["notes"];

export const SELECT_OPTIONS: Record<string, { label: string; value: string }[]> = {
    collarType: [
        { label: "Regular", value: "regular" },
        { label: "Mandarin / Chinese", value: "mandarin" },
        { label: "Band / Collar Band", value: "band" },
        { label: "Spread", value: "spread" },
        { label: "Button-down", value: "button_down" },
        { label: "Nehru", value: "nehru" },
        { label: "None", value: "none" },
    ],
    cuffType: [
        { label: "Single", value: "single" },
        { label: "Double", value: "double" },
        { label: "French / Link", value: "french" },
        { label: "None", value: "none" },
    ],
    fitType: [
        { label: "Regular", value: "regular" },
        { label: "Slim", value: "slim" },
        { label: "Loose / Comfort", value: "loose" },
        { label: "Tailored", value: "tailored" },
    ],
    trouserType: [
        { label: "Straight", value: "straight" },
        { label: "Slim", value: "slim" },
        { label: "Bootcut", value: "bootcut" },
        { label: "Bell Bottoms", value: "bell_bottom" },
        { label: "Pleated", value: "pleated" },
        { label: "Wide / Baggy", value: "wide" },
        { label: "Shalwar Cut", value: "shalwar_cut" },
    ],
    riseType: [
        { label: "Low", value: "low" },
        { label: "Regular", value: "regular" },
        { label: "High", value: "high" },
    ],
    hemType: [
        { label: "No Turn", value: "no_turn" },
        { label: "Turn", value: "turn" },
    ],
    frontPocketType: [
        { label: "Type 1 (Curved)", value: "type_1" },
        { label: "Type 2 (Slanted)", value: "type_2" },
        { label: "Regular", value: "regular" },
        { label: "None", value: "none" },
    ],
    backPocketType: [
        { label: "Regular", value: "regular" },
        { label: "Flap", value: "flap" },
        { label: "None", value: "none" },
    ],
    lapelStyle: [
        { label: "Notch", value: "notch" },
        { label: "Peak", value: "peak" },
        { label: "Shawl", value: "shawl" },
        { label: "None", value: "none" },
    ],
    neckStyle: [
        { label: "Round", value: "round" },
        { label: "V-Neck", value: "v_neck" },
        { label: "Square", value: "square" },
        { label: "Boat", value: "boat" },
        { label: "High Neck", value: "high" },
        { label: "Collar", value: "collar" },
    ],
    armType: [
        { label: "Round Arms", value: "round_arms" },
        { label: "Functional Buttons", value: "functional_buttons" },
    ],
    ventType: [
        { label: "Single", value: "single" },
        { label: "Double", value: "double" },
        { label: "No Vents", value: "none" },
    ],
    waistcoatType: [
        { label: "Round Neck", value: "round_neck" },
        { label: "V-Neck", value: "v_neck" },
        { label: "Ban Collar", value: "ban_collar" },
    ],
};

export const isFieldVisible = (type: string, field: MeasurementField): boolean => {
    if (!type || !(type in DRESS_TYPE_FIELDS)) return false;
    return DRESS_TYPE_FIELDS[type as DressType].includes(field);
};

export const dressTypeLabel = (type?: string) =>
    DRESS_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type ?? "—";
