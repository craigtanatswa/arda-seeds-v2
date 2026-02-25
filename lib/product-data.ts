import type { Product } from "@/lib/types"

// Maize pack sizes (all varieties share same pricing per pricelist)
const maizePackSizes = [
  { size: "2kg", price: 10 },
  { size: "5kg", price: 19.8 },
  { size: "10kg", price: 38.3 },
  { size: "25kg", price: 95.7 },
]

export const maizeProducts: Product[] = [
  {
    id: "zs263",
    name: "ZS263",
    category: "maize",
    shortDescription: "An exceptional new early maturing variety which takes 120-125 days.",
    fullDescription:
      "ZS263 is an exceptional new early maturing variety which takes 120-125 days. It is suitable for low to medium potential areas, though it can be grown as a late crop in high potential areas. This variety has good disease tolerance, including Grey Leaf Spot, Maize Streak Virus and Leaf Blight. It also has good levels of drought and low nitrogen tolerance.",
    maturity: "120-125 days",
    yieldPotential: "10t/ha",
    features: ["Early maturing variety", "Good disease tolerance", "Drought tolerant", "Low nitrogen tolerance"],
    regions: ["Low potential areas", "Medium potential areas", "High potential areas (late crop)"],
    image: "/images/maizeImages/GREEN MAIZE 3D.jpg",
    featured: true,
    packSizes: maizePackSizes,
  },
  {
    id: "zs265a",
    name: "ZS265A",
    category: "maize",
    shortDescription: "Multi-cobbing white hybrid maize, medium maturing, 130 days.",
    fullDescription:
      "ZS265A is a multi-cobbing white hybrid maize with medium maturity, taking 130 days to reach maturity. It is an adaptable variety suitable for all maize growing areas. This variety performs extremely well under low fertility conditions and drought prone areas and can be produced in high potential areas. It has good tolerance to Maize Streak Virus, Grey Leaf Spot, Northern Leaf Blight and Common Rust.",
    maturity: "130 days",
    yieldPotential: "12t/ha",
    features: [
      "Multi-cobbing white hybrid",
      "Adaptable to all maize growing areas",
      "Performs well under low fertility conditions",
      "Good disease tolerance",
    ],
    regions: ["All maize growing areas", "Drought prone areas", "High potential areas"],
    image: "/images/maizeImages/GREEN MAIZE 3D.jpg",
    featured: false,
    packSizes: maizePackSizes,
  },
  {
    id: "zs269",
    name: "ZS269",
    category: "maize",
    shortDescription: "Drought tolerant hybrid maize, white medium maturity three-way hybrid.",
    fullDescription:
      "ZS269 is a drought tolerant white medium maturity three-way hybrid. It has good tolerance to maize streak virus, GLS, northern leaf blight, common rust and ear rots. This variety is suitable for production in all country's agro-ecological zones.",
    maturity: "Medium maturity",
    yieldPotential: "9-12t/ha",
    features: [
      "Drought tolerant",
      "White medium maturity three-way hybrid",
      "Good disease tolerance",
      "Suitable for all agro-ecological zones",
    ],
    regions: ["All country's agro-ecological zones"],
    image: "/images/maizeImages/GREEN MAIZE 3D.jpg",
    featured: true,
    packSizes: [
      { size: "2kg", price: 9.5 },
      { size: "5kg", price: 19.8 },
      { size: "10kg", price: 38.3 },
      { size: "25kg", price: 95.7 },
    ],
  },
  {
    id: "zs248a",
    name: "ZS248A",
    category: "maize",
    shortDescription: "Early to medium maturity, requiring 130-138 days to reach maturity.",
    fullDescription:
      "ZS248A is an early to medium maturity variety, requiring 130-138 days to reach maturity. It is drought tolerant and pest and disease tolerant. This variety features multiple cobbing, with an average of 2-3 cobs per plant, resulting in high yield potential of 7 to 10 t/ha.",
    maturity: "130-138 days",
    yieldPotential: "7-10t/ha",
    features: [
      "Early to medium maturity",
      "Drought tolerant",
      "Pest and disease tolerant",
      "Multiple cobbing (2-3 cobs per plant)",
    ],
    regions: ["All regions"],
    image: "/images/maizeImages/GREEN MAIZE 3D.jpg",
    featured: false,
    packSizes: [
      { size: "2kg", price: 9.5 },
      { size: "5kg", price: 19.8 },
      { size: "10kg", price: 38.3 },
      { size: "25kg", price: 95.7 },
    ],
  },
  {
    id: "opv-zm-521",
    name: "OPV ZM 521",
    category: "maize",
    shortDescription: "Early maturing white Open Pollinated Variety (OPV) taking 120 to 130 days to maturity.",
    fullDescription:
      "OPV ZM 521 is an early maturing white Open Pollinated Variety (OPV) that takes 120 to 130 days to maturity. It excels under drought and low fertility conditions and is widely adapted to Natural Regions IIb, III and IV. This variety has good Grey Leaf Spot (GLS) tolerance.",
    maturity: "120-130 days",
    yieldPotential: "4-7t/ha",
    features: [
      "Early maturing white OPV",
      "Excels under drought and low fertility conditions",
      "Good Grey Leaf Spot tolerance",
      "Widely adapted to multiple regions",
    ],
    regions: ["Natural Region IIb", "Natural Region III", "Natural Region IV"],
    image: "/images/maizeImages/GREEN MAIZE 3D.jpg",
    featured: false,
    packSizes: maizePackSizes,
  },
]

export const wheatProducts: Product[] = [
  {
    id: "ncema",
    name: "NCEMA",
    category: "wheat",
    shortDescription: "High yielding, large grain, semi dwarf (81cm) variety with semi erect growth habit.",
    fullDescription:
      "NCEMA is a high yielding, large grain, semi dwarf (81cm) variety with semi erect growth habit. It is an early to medium variety taking approximately 136 days in Highveld, 120 days in Middleveld, and 109 days in Lowveld. This variety features large grain size with an average thousand grain weight of 46 grams and grain protein content of 11.4%. It has good disease resistance qualities to Leaf Rust, Stem Rust and Powdery Mildew.",
    maturity: "109-136 days (region dependent)",
    yieldPotential: "6-10t/ha (region dependent)",
    features: [
      "High yielding, large grain variety",
      "Semi dwarf (81cm) with semi erect growth habit",
      "Large grain size (46g per thousand grains)",
      "11.4% grain protein content",
      "Good disease resistance to Leaf Rust, Stem Rust and Powdery Mildew",
    ],
    regions: ["Highveld", "Middleveld", "Lowveld"],
    image: "/images/wheatImages/WHEAT 3D.jpg",
    featured: true,
    packSizes: [
      { size: "2kg", price: 3.5 },
      { size: "5kg", price: 8.5 },
      { size: "10kg", price: 16.5 },
    ],
  },
]

export const soybeanProducts: Product[] = [
  {
    id: "bimha",
    name: "BIMHA",
    category: "soybeans",
    shortDescription: "Determinate broad-leafed soybean variety with high yields and excellent disease resistance.",
    fullDescription:
      "BIMHA is a determinate broad-leafed soybean variety recommended for grain production in all soybean growing areas. It features large yellow seeds with yellow hilum and offers high yields and grades. This variety has acceptable resistance to red leaf blotch, downy mildew, and bacterial blight, with moderate resistance to frog-eye leaf spot.",
    maturity: "110-120 days",
    yieldPotential: "3-4 t/ha",
    features: [
      "Determinate broad-leafed variety",
      "Large yellow seeds with yellow hilum",
      "Resistant to red leaf blotch, downy mildew, and bacterial blight",
      "Moderately resistant to frog-eye leaf spot",
      "High yields and excellent grades"
    ],
    regions: ["All soybean growing areas"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "25kg", price: 47 },
    ],
  },
  {
    id: "mhofu",
    name: "MHOFU",
    category: "soybeans",
    shortDescription: "Broad-leafed determinate variety suitable for high, middle and lowveld areas.",
    fullDescription:
      "MHOFU is a broad-leafed determinate soybean variety specifically bred for grain production. It is suitable for high, middle and lowveld areas and matures in up to 126 days with good pod clearance from the ground. This variety shows moderate levels of resistance to leaf spot, red leaf blotch and bacterial blight, making it a reliable choice for various growing conditions.",
    maturity: "126 days",
    yieldPotential: "3-4 t/ha",
    features: [
      "Bred for grain production",
      "Good pod clearance from ground",
      "Moderate resistance to leaf spot, red leaf blotch and bacterial blight",
      "Suitable for Highveld, Middleveld and Lowveld",
      "Consistent high yields"
    ],
    regions: ["Highveld", "Middleveld", "Lowveld"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "50kg", price: 94 },
    ],
  },
];

export const groundnutProducts: Product[] = [
  {
    id: "ilanda",
    name: "Ilanda",
    category: "groundnuts",
    shortDescription: "Short-season groundnut variety with high pod yield potential.",
    fullDescription:
      "Ilanda is a short-season groundnut variety that matures in 90-100 days in lowveld areas and 100-120 days in middle/highveld regions. It features an erect/lax bunch growth habit with moderate tolerance to leaf spot diseases. This variety has no seed dormancy and is recommended for rain-fed production in warmer and drier areas of the country. Ilanda delivers high pod yields of up to 4t/ha and kernel yields of 2.8t/ha.",
    maturity: "90-120 days (region dependent)",
    yieldPotential: "4t/ha (pod yield), 2.8t/ha (kernel yield)",
    features: [
      "Short-season variety",
      "Erect/lax bunch growth habit",
      "Moderate tolerance to leaf spot diseases",
      "No seed dormancy",
      "High pod and kernel yields"
    ],
    regions: ["Lowveld", "Middleveld", "Highveld"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "2kg", price: 3 },
      { size: "5kg", price: 7.5 },
      { size: "10kg", price: 15 },
    ],
  },
];

export const sunflowerProducts: Product[] = [
  {
    id: "peredovic",
    name: "PEREDOVIC",
    category: "sunflower",
    shortDescription: "Medium duration sunflower ideal for marginal production areas with up to 39% oil content.",
    fullDescription:
      "PEREDOVIC is a medium duration sunflower variety maturing in 100-115 days. It is ideal for marginal production areas and features soft seeds that are perfect for small scale oil presses such as the ram press. With an average plant height of 200cm, this variety offers high oil content of up to 39% and good adaptability to various growing conditions.",
    maturity: "100-115 days",
    yieldPotential: "0.8-2.5t/ha seed yield",
    features: [
      "Medium duration variety",
      "Ideal for marginal production areas",
      "Soft seeded for small scale oil presses",
      "Up to 39% oil content",
      "Average plant height: 200cm"
    ],
    regions: ["Marginal production areas", "Various ecological zones"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "2kg", price: 8.6 },
      { size: "5kg", price: 35 },
    ],
  },
  {
    id: "msasa",
    name: "MSASA",
    category: "sunflower",
    shortDescription: "Early maturing sunflower with up to 45% oil content and excellent adaptability.",
    fullDescription:
      "MSASA is an early maturing sunflower variety that reaches maturity in 80-90 days. It features soft seeds with exceptional oil content of up to 45%. With a moderate plant height of 150-170cm, this variety offers excellent adaptability to different growing conditions and high yield potential. MSASA is suitable for both small-scale and commercial sunflower production.",
    maturity: "80-90 days",
    yieldPotential: "Up to 2.5t/ha",
    features: [
      "Early maturing variety (80-90 days)",
      "Soft seeded with up to 45% oil content",
      "Plant height: 150-170cm",
      "High yield potential",
      "Excellent adaptability"
    ],
    regions: ["Various ecological zones", "All sunflower growing areas"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "5kg", price: 21.5 },
    ],
  },
];

// ===== COWPEAS =====
export const cowpeaProducts: Product[] = [
  {
    id: "cbc1",
    name: "CBC1",
    category: "cowpeas",
    shortDescription: "Early maturing dual purpose Traditional African Pea variety with high resistance to CABMV.",
    fullDescription:
      "CBC1 is an early maturing Traditional African Pea variety taking approximately 75 days to maturity. It is a dual purpose determinate variety with an upright and bushy growth habit. This variety exhibits high levels of resistance to cowpea aphids borne mosaic virus (CABMV). Recommended for regions III, IV & V, CBC1 offers reliable yields even in challenging conditions.",
    maturity: "75 days",
    yieldPotential: "1.5t/ha",
    features: [
      "Early maturing variety (75 days)",
      "Dual purpose determinate variety",
      "Upright and bushy growth habit",
      "High resistance to Traditional African Pea aphids borne mosaic virus (CABMV)",
      "Suitable for regions III, IV & V"
    ],
    regions: ["Region III", "Region IV", "Region V"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "5kg", price: 12.5 },
    ],
  },
  {
    id: "cbc2",
    name: "CBC2",
    category: "cowpeas",
    shortDescription: "Early maturing cowpea variety with upright growth habit and CABMV resistance.",
    fullDescription:
      "CBC2 is an early maturing cowpea variety taking 75-85 days to maturity. It is a determinate variety with an upright growth habit, making it suitable for mechanical harvesting. This variety shows high levels of resistance to cowpea aphids borne mosaic virus (CABMV) and is recommended for production in regions III, IV & V. CBC2 offers good yield potential for both grain and forage purposes.",
    maturity: "75-85 days",
    yieldPotential: "2.5t/ha",
    features: [
      "Early maturing variety (75-85 days)",
      "Determinate with upright growth habit",
      "High resistance to CABMV",
      "Suitable for mechanical harvesting",
      "Recommended for regions III, IV & V"
    ],
    regions: ["Region III", "Region IV", "Region V"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "2kg", price: 5 },
      { size: "10kg", price: 25 },
    ],
  },
];

// ===== SUGAR BEANS =====
export const sugarBeanProducts: Product[] = [
  {
    id: "nua45",
    name: "NUA45",
    category: "sugarbeans",
    shortDescription: "Large seeded red mottled sugar bean variety with drought tolerance.",
    fullDescription:
      "NUA45 is a large seeded red mottled sugar bean variety that grows well across Zimbabwe. With a maturity period of 80-85 days, this drought tolerant variety offers excellent adaptability to various growing conditions. NUA45 exhibits a high level of tolerance to common bean rust and bacterial blight, making it a reliable choice for farmers seeking consistent yields.",
    maturity: "80-85 days",
    yieldPotential: "Up to 3t/ha",
    features: [
      "Large seeded red mottled variety",
      "Drought tolerant",
      "Grows well across Zimbabwe",
      "High tolerance to common bean rust and bacterial blight",
      "Early maturing (80-85 days)"
    ],
    regions: ["All regions of Zimbabwe", "Various ecological zones"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "10kg", price: 43 },
      { size: "25kg", price: 107.5 },
    ],
  },
  {
    id: "gloria",
    name: "GLORIA",
    category: "sugarbeans",
    shortDescription: "Early maturing sugar bean variety with semi-determinate growth habit.",
    fullDescription:
      "GLORIA is an early maturing sugar bean variety taking approximately 90 days to reach maturity. It features a semi-determinate growth habit and broad leaf determinate characteristics. This variety shows a high level of tolerance to common bean rust and bacterial diseases, making it suitable for various growing conditions across Zimbabwe.",
    maturity: "Approximately 90 days",
    yieldPotential: "Good yield potential",
    features: [
      "Early maturing variety (± 90 days)",
      "Semi-determinate growth habit",
      "Broad leaf determinate variety",
      "High tolerance to common bean rust",
      "Good disease resistance"
    ],
    regions: ["Various ecological zones", "All sugar bean growing areas"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "2kg", price: 8.6 },
      { size: "5kg", price: 21.5 },
    ],
  },
];

// ===== SORGHUM =====
export const sorghumProducts: Product[] = [
  {
    id: "macia",
    name: "MACIA",
    category: "sorghum",
    shortDescription: "White Open Pollinated sorghum variety well adapted to regions IV & V.",
    fullDescription:
      "MACIA is a white Open Pollinated Variety sorghum that is well adapted to regions IV & V. This short to medium maturing variety takes 110-130 days to reach maturity. It features uniform short statured robust plants with bold compact heads, making it suitable for mechanical harvesting. MACIA offers good disease tolerance and reliable yield potential for challenging growing conditions.",
    maturity: "110-130 days",
    yieldPotential: "1.5-3t/ha",
    features: [
      "White Open Pollinated Variety",
      "Well adapted to regions IV & V",
      "Short to medium maturing (110-130 days)",
      "Uniform short statured robust plants",
      "Bold compact heads",
      "Good disease tolerance"
    ],
    regions: ["Region IV", "Region V", "Drought prone areas"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "2kg", price: 5.2 },
      { size: "5kg", price: 13 },
      { size: "10kg", price: 26 },
    ],
  },
  {
    id: "sv2-sv4",
    name: "SV2/SV4",
    category: "sorghum",
    shortDescription: "White Open Pollinated sorghum adapted to regions I, II, III & IV.",
    fullDescription:
      "SV2/SV4 is a white Open Pollinated sorghum variety adapted to regions I, II, III & IV. This medium to late maturing variety features intermediate height plants with good disease tolerance. SV2/SV4 offers consistent yield potential and is suitable for both grain and forage production in various ecological zones across Zimbabwe.",
    maturity: "Medium to late maturing",
    yieldPotential: "3t/ha",
    features: [
      "White Open Pollinated Variety",
      "Adapted to regions I, II, III & IV",
      "Medium to late maturing variety",
      "Intermediate height plants",
      "Good disease tolerance",
      "Suitable for grain and forage"
    ],
    regions: ["Region I", "Region II", "Region III", "Region IV"],
    image: "/images/wheat/wheat3D.jpg",
    featured: true,
    packSizes: [
      { size: "2kg", price: 5.2 },
      { size: "5kg", price: 13 },
      { size: "10kg", price: 26 },
    ],
  },
];
