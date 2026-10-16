/**
 * Agronomic knowledge used by the ARDA Seeds chat assistant.
 *
 * Guidance for maize, wheat, soybeans, groundnuts and sunflower is taken from
 * our published planting guides under app/agronomy/guides. Guidance for
 * sorghum, cowpeas and sugar beans is general Zimbabwe field practice and is
 * labelled as such in the prompt because no published guide exists yet.
 */

export type AgronomyTopic = {
  crop: string
  /** Lower-case substrings that pull this topic into the chat context. */
  keywords: string[]
  /** True when the facts come from a published ARDA planting guide. */
  published: boolean
  facts: string[]
}

export const AGRONOMY_TOPICS: AgronomyTopic[] = [
  {
    crop: "Maize",
    keywords: ["maize", "mealie", "corn", "zs263", "zs265", "zs269", "zs248", "opv"],
    published: true,
    facts: [
      "Planting window: November to December, at the onset of reliable rains. Soil temperature should be above 10 degrees C for germination. Avoid planting after mid-January in most regions; early planting generally gives better yields.",
      "Plant population: 37,000-53,000 plants/ha depending on variety. Row spacing 75-90cm, in-row spacing 25-30cm, planting depth 5-7cm.",
      "Land preparation: clear previous residues and weeds, deep plough 20-25cm, harrow to a fine seedbed and make sure drainage is good. Do this 2-3 weeks before planting.",
      "Basal fertiliser: Compound D (7:14:7) at 200-400kg/ha at planting.",
      "Top dressing: Ammonium Nitrate (34.5% N) at 200-300kg/ha - first application 3-4 weeks after emergence, second at 6-8 weeks (tasseling).",
      "Weed control: pre-emergence herbicide within 48 hours of planting, first weeding 2-3 weeks after planting, second weeding 5-6 weeks after planting. Keep the field weed-free for the first 6 weeks.",
      "Moisture: 450-650mm across the season. Critical stages are germination, tasseling and grain filling. Avoid waterlogging, which encourages disease.",
      "Key diseases: grey leaf spot, maize streak virus, northern leaf blight and common rust. Manage with resistant varieties, crop rotation, early planting and fungicides where needed. ARDA maize hybrids are bred for tolerance to these diseases.",
      "Harvest: when cobs are mature and husks brown and dry, at roughly 20-25% grain moisture. Dry grain to 12.5% moisture before storage, then store in clean, dry, well-ventilated sheds and monitor for moisture and pests.",
      "Varieties: ZS263 (120-125 days, 10t/ha), ZS265 (130 days, 12t/ha), ZS269 (medium maturity, 9-12t/ha), ZS248A (130-138 days, 7-10t/ha), OPV ZM 521 (120-130 days, 4-7t/ha, suited to low-input and drought-prone areas).",
    ],
  },
  {
    crop: "Wheat",
    keywords: ["wheat", "ncema"],
    published: true,
    facts: [
      "Planting window: April to May (winter wheat). Earlier planting generally produces higher yields; avoid very late planting so the crop grows enough before the cold.",
      "Seeding rate 100-120kg/ha. Row spacing 15-20cm, planting depth 2-4cm, target density 250-350 plants per square metre.",
      "Land preparation: deep plough 20-25cm, harrow to a fine firm seedbed, remove residues and weeds, ensure drainage. Do this 3-4 weeks before planting.",
      "Basal fertiliser: Compound D at 200-300kg/ha at planting.",
      "Top dressing: Ammonium Nitrate at 150-200kg/ha at tillering. Extra potassium may be needed on sandy soils.",
      "Weed control: pre-emergence herbicide within 48 hours of planting and early weeding for establishment; keep the crop weed-free for the first 4 weeks. Selective herbicides are available for broadleaf weeds.",
      "Moisture: critical stages are germination, tillering, flowering and grain filling. Avoid water stress at flowering and grain filling; good drainage prevents root diseases.",
      "Key diseases: leaf rust, stem rust and powdery mildew. NCEMA has good resistance to all three. Use resistant varieties and fungicides where needed.",
      "Harvest: at 13-15% grain moisture, grains hard and fully mature; combine harvesting is common. Dry immediately to 12% moisture for storage in clean, dry, well-ventilated sheds.",
      "Variety: NCEMA - high yielding, large grain, semi dwarf (81cm), 46g per thousand grains, 11.4% protein, 6-10t/ha, 109-136 days depending on region (Highveld 136 days, Middleveld 120 days, Lowveld 109 days).",
    ],
  },
  {
    crop: "Soybeans",
    keywords: ["soybean", "soya", "soy", "bimha", "mhofu"],
    published: true,
    facts: [
      "Planting window: November to December with reliable rains. Soil temperature above 15 degrees C. Earlier planting generally gives better yields; avoid planting after mid-January.",
      "Seeding rate 80-100kg/ha. Row spacing 45-60cm, in-row spacing 5-10cm, planting depth 2-4cm.",
      "Land preparation: deep plough 20-25cm to break hardpans, harrow to a fine firm seedbed, level the field and ensure drainage. Do this 2-3 weeks before planting.",
      "Inoculate seed with rhizobium bacteria. Soybeans fix their own nitrogen when properly inoculated.",
      "Basal fertiliser: Compound D at 200-300kg/ha. Phosphorus is critical for good nodulation.",
      "Weed control: pre-emergence herbicide within 48 hours of planting, first weeding 2-3 weeks after planting, second weeding 5-6 weeks after planting. Keep weed-free for the first 6 weeks.",
      "Moisture: 450-700mm across the season. Critical stages are flowering and pod filling; avoid water stress at flowering and keep drainage good to prevent root diseases.",
      "Key diseases: red leaf blotch (high risk), frog-eye leaf spot, downy mildew and bacterial blight. BIMHA and MHOFU are bred with resistance to red leaf blotch, downy mildew and bacterial blight. Rotation and fungicides help.",
      "Harvest: when about 95% of pods have turned brown, at 15-18% moisture and with leaves fully shed. Harvest promptly to limit shattering losses. Dry to 12% moisture for storage.",
      "Varieties: BIMHA (110-120 days, 3-4t/ha, determinate broad-leafed, large yellow seeds, high yields and grades), MHOFU (126 days, 3-4t/ha, good pod clearance, suitable for Highveld, Middleveld and Lowveld).",
    ],
  },
  {
    crop: "Groundnuts",
    keywords: ["groundnut", "ground nut", "nut", "ilanda", "peanut"],
    published: true,
    facts: [
      "Planting window: November to December with reliable rains. Soil temperature above 15 degrees C. Best suited to warmer, drier areas; avoid waterlogged fields.",
      "Seeding rate 80-100kg/ha for bunch types. Row spacing 45-60cm, in-row spacing 10-15cm, planting depth 5-7cm.",
      "Land preparation: deep plough 20-25cm for good pod development, form ridges or beds for easier harvesting, use well-drained sandy loam soils and remove residues. Do this 2-3 weeks before planting.",
      "Basal fertiliser: Compound D at 200-300kg/ha. Limit nitrogen because groundnuts fix their own nitrogen.",
      "Gypsum at 30-40kg/ha at flowering improves pod development and filling.",
      "Weed control: pre-emergence herbicide within 48 hours of planting, first weeding 2-3 weeks after planting, second weeding 5-6 weeks after planting. Keep weed-free for the first 6 weeks.",
      "Moisture: 400-600mm across the season. Critical stages are flowering and pod filling; avoid water stress during pod development and keep drainage good to prevent rot.",
      "Key threats: early leaf spot and late leaf spot (high risk - use crop rotation of 3-4 years and fungicides at flowering), and aflatoxin contamination in stored pods (control with proper drying, sanitation and good storage).",
      "Harvest: when 70-80% of pods show dark veins, at 20-25% moisture. Lift pods carefully, dry immediately, then dry pods to 10% moisture for storage in well-ventilated conditions.",
      "Variety: Ilanda - short season, 90-100 days in the Lowveld and 100-120 days in Middleveld/Highveld, 4t/ha pod yield and 2.8t/ha kernel yield, erect/lax bunch, moderate leaf spot tolerance, no seed dormancy.",
    ],
  },
  {
    crop: "Sunflower",
    keywords: ["sunflower", "peredovic", "msasa", "oil"],
    published: true,
    facts: [
      "Planting window: November to December with the onset of reliable rains. Soil temperature above 15 degrees C. Avoid late planting for best yields.",
      "Seeding rate 5-7kg/ha. Row spacing 60-90cm, in-row spacing 20-30cm, planting depth 2-5cm, target 20,000-30,000 plants/ha.",
      "Land preparation: deep plough 20-25cm, harrow to a fine firm seedbed, level the field and ensure drainage. Do this 2-3 weeks before planting.",
      "Basal fertiliser: Compound D at 200-300kg/ha. Sunflower responds well to potassium. Top dress Ammonium Nitrate at 100-150kg/ha about 4-6 weeks after planting.",
      "Weed control: pre-emergence herbicide within 48 hours of planting, first weeding 2-3 weeks after planting, second weeding 5-6 weeks after planting. The critical weed-free period is the first 6 weeks.",
      "Moisture: critical stages are flowering and seed filling. Avoid water stress at flowering; good drainage prevents disease.",
      "Harvest: when the back of the heads turns yellow-brown and seeds are firm, at 12-15% moisture. Harvest in good time to reduce bird damage. Dry seed to 9-10% moisture for storage.",
      "Varieties: PEREDOVIC (100-115 days, 0.8-2.5t/ha, up to 39% oil, soft seeded for small oil presses, about 200cm tall, good for marginal areas), MSASA (80-90 days, up to 2.5t/ha, up to 45% oil, soft seeded, 150-170cm tall).",
    ],
  },
  {
    crop: "Sorghum",
    keywords: ["sorghum", "macia", "sv2", "sv4"],
    published: false,
    facts: [
      "Planting window: November to December with reliable rains. Sorghum suits dry, low-rainfall areas and Natural Regions III, IV and V.",
      "Typical seeding rate about 5-10kg/ha in rows. Row spacing 45-90cm with 10-15cm between plants, planting depth 2.5-5cm.",
      "Sorghum tolerates low fertility, but a basal application of Compound D and a nitrogen top dressing after emergence improve yields on poor soils.",
      "Keep the field weed-free early in the season; sorghum is a poor competitor while young.",
      "Watch for bird damage as the grain fills, and for stem borers and head bugs. Timely harvest reduces losses.",
      "Harvest when grain is hard and heads are dry, then dry to about 12% moisture for storage.",
      "Varieties: MACIA (110-130 days, 1.5-3t/ha, well adapted to Regions IV and V), SV2/SV4 (medium to late maturing, 3t/ha, adapted to Regions I-IV).",
    ],
  },
  {
    crop: "Cowpeas",
    keywords: ["cowpea", "cbc1", "cbc2", "nyemba"],
    published: false,
    facts: [
      "Planting window: November to December with the first reliable rains. Suited to Regions III, IV and V.",
      "Typical seeding rate about 20-25kg/ha. Row spacing 45-60cm with 15-20cm between plants, planting depth 2-4cm.",
      "Cowpeas fix their own nitrogen, so keep nitrogen low and apply a small basal dressing of Compound D where soils are poor.",
      "Keep the crop weed-free for the first 6 weeks.",
      "Main threat is cowpea aphid-borne mosaic virus, spread by aphids. CBC1 and CBC2 carry high resistance; control aphids and rogue out infected plants.",
      "Harvest when pods dry and turn brown, then dry the grain to about 12% moisture for storage. Watch for storage weevils.",
      "Varieties: CBC1 (about 75 days, 1.5t/ha, dual purpose, upright and bushy), CBC2 (75-85 days, 2.5t/ha, determinate and upright, suited to mechanical harvesting).",
    ],
  },
  {
    crop: "Sugar beans",
    keywords: ["sugar bean", "sugarbean", "bean", "nua45", "gloria"],
    published: false,
    facts: [
      "Planting window: November to December with reliable rains for the summer crop; a February to March planting is also possible where moisture allows.",
      "Typical seeding rate about 80-100kg/ha. Row spacing 45-60cm with about 10cm between plants, planting depth 3-5cm.",
      "Apply a basal dressing of Compound D at planting. Sugar beans need adequate moisture and are sensitive to water stress at flowering and pod filling.",
      "Keep the crop weed-free for the first 6 weeks.",
      "Key diseases are common bean rust and bacterial blight. NUA45 and GLORIA have good tolerance. Rotate with cereals to reduce disease pressure.",
      "Harvest when pods dry and turn brown, then dry the grain to about 12% moisture for storage.",
      "Varieties: NUA45 (80-85 days, up to 3t/ha, large seeded red mottled, drought tolerant), GLORIA (about 90 days, semi-determinate, broad leaf determinate).",
    ],
  },
]

const AGRONOMY_TRIGGERS = [
  "plant",
  "sow",
  "spacing",
  "seed rate",
  "population",
  "depth",
  "fertilis",
  "fertiliz",
  "compound d",
  "ammonium",
  "top dress",
  "gypsum",
  "lime",
  "weed",
  "herbicide",
  "disease",
  "pest",
  "rust",
  "blight",
  "streak",
  "mildew",
  "aphid",
  "harvest",
  "stor",
  "moisture",
  "irrigat",
  "yield",
  "grow",
  "cultivat",
  "agronom",
  "inocul",
  "rotat",
  "germinat",
  "tassel",
  "nitrogen",
  "soil",
]

/** True when the question looks like it is about growing a crop. */
export function isAgronomyQuery(query: string): boolean {
  const lower = query.toLowerCase()
  return AGRONOMY_TRIGGERS.some((trigger) => lower.includes(trigger))
}

/**
 * Returns the agronomy knowledge block for the crops mentioned in the query,
 * or an empty string when the question is not about growing crops.
 */
export function retrieveAgronomyContext(query: string): string {
  const lower = query.toLowerCase()

  const matched = AGRONOMY_TOPICS.filter(
    (topic) =>
      lower.includes(topic.crop.toLowerCase()) || topic.keywords.some((keyword) => lower.includes(keyword)),
  )

  if (matched.length === 0) {
    if (!isAgronomyQuery(query)) return ""
    return [
      "Crop agronomy knowledge:",
      "Our published planting guides cover maize, wheat, soybeans, groundnuts and sunflower (see /agronomy).",
      "For sorghum, cowpeas and sugar beans we do not yet publish a guide; share general Zimbabwe field practice and point the user to /contact for a tailored plan.",
    ].join("\n")
  }

  return [
    "Crop agronomy knowledge (use for planting, growing and harvesting advice):",
    ...matched.map((topic) => {
      const heading = topic.published
        ? `${topic.crop} - from our published planting guide`
        : `${topic.crop} - general Zimbabwe practice (we do not yet publish a guide for this crop)`
      return `${heading}:\n${topic.facts.map((fact) => `- ${fact}`).join("\n")}`
    }),
  ].join("\n\n")
}
