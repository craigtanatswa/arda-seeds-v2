export type Service = {
  id: string
  name: string
  shortDescription: string
  description: string
  heroImage: string
  image: string
  features: string[]
  benefits: string[]
  processSteps: { title: string; description: string }[]
}

export const services: Service[] = [
  {
    id: "outgrowing",
    name: "Outgrowing",
    shortDescription:
      "Join our contract seed production programme — we provide inputs and technical support; you grow seed and repay us in the agreed quantity of certified seed.",
    description:
      "ARDA Seeds partners with individual farmers and grower groups through a structured outgrower scheme. We supply foundation seed and agreed inputs on credit, provide field supervision throughout the season, and purchase back certified seed at pre-agreed terms. This model expands national seed availability while giving growers access to markets, inputs, and expert agronomic backing.",
    heroImage: "/images/Maize field.jpg",
    image: "/images/Maize field.jpg",
    features: [
      "Open to individual farmers and organised grower groups",
      "Foundation seed and inputs supplied on agreed credit terms",
      "Repayment in certified seed at pre-agreed volumes and quality grades",
      "Field inspections and technical supervision throughout the season",
      "Quality testing, grading, and certification support at harvest",
      "Transparent contracts covering crop, area, inputs, and delivery schedule",
    ],
    benefits: [
      "Access to premium seed genetics without full upfront input costs",
      "Guaranteed offtake market for seed produced to specification",
      "Hands-on technical support from ARDA agronomists",
      "Builds long-term seed production skills and income streams",
    ],
    processSteps: [
      {
        title: "Registration & Assessment",
        description:
          "Farmers apply to join the programme. We assess land suitability, water availability, cropping history, and capacity to meet seed production standards.",
      },
      {
        title: "Contract & Input Delivery",
        description:
          "A contract is signed specifying crop variety, hectarage, inputs to be supplied, expected seed yield, and repayment quantities. Foundation seed and inputs are delivered before planting.",
      },
      {
        title: "Production & Supervision",
        description:
          "Growers follow ARDA seed production protocols — isolation distances, rouging, pest management, and harvest timing — with regular field visits from our team.",
      },
      {
        title: "Harvest, Delivery & Settlement",
        description:
          "Seed is harvested, dried, and delivered to ARDA for grading and certification. Input costs are settled through the agreed seed repayment, with surplus production paid at market rates.",
      },
    ],
  },
  {
    id: "agronomic-support",
    name: "Agronomic Support & Farmer Training",
    shortDescription:
      "Expert crop advice, field diagnostics, and practical farmer training to improve yields and seed quality across Zimbabwe's ecological zones.",
    description:
      "Our agronomy team supports farmers from land preparation through harvest with evidence-based recommendations tailored to variety, region, and season. We combine on-farm advisory visits with structured farmer training — field days, demonstration plots, and workshops — so growers can apply best practices for crop establishment, nutrition, integrated pest management, and post-harvest handling.",
    heroImage: "/images/Wheat field.jpg",
    image: "/images/Wheat field.jpg",
    features: [
      "On-farm visits and crop scouting for pests, diseases, and nutrient deficiencies",
      "Variety selection and planting-window guidance by ecological region",
      "Fertiliser and crop nutrition programmes aligned to soil conditions",
      "Integrated pest and disease management (IPM) recommendations",
      "Farmer training workshops, field days, and demonstration plot learning",
      "Planting guides and seasonal advisories for all major ARDA varieties",
    ],
    benefits: [
      "Higher and more consistent yields through timely, variety-specific advice",
      "Reduced crop losses from early pest and disease identification",
      "Practical skills transfer through hands-on farmer training sessions",
      "Better seed quality when production protocols are followed correctly",
    ],
    processSteps: [
      {
        title: "Needs Assessment",
        description:
          "We review your crop, location, soil history, and production goals to identify priority agronomic interventions for the season.",
      },
      {
        title: "Tailored Recommendations",
        description:
          "Our agronomists develop a field plan covering planting density, fertiliser rates, weed control, and pest monitoring schedules.",
      },
      {
        title: "Farmer Training & Field Days",
        description:
          "Growers attend practical sessions on topics such as seed handling, crop scouting, safe chemical use, and harvest timing at demo plots or on-farm.",
      },
      {
        title: "Season-Long Follow-Up",
        description:
          "Regular check-ins and seasonal updates ensure recommendations are adjusted as weather and crop conditions change.",
      },
    ],
  },
  {
    id: "farm-mechanisation",
    name: "Farm Mechanisation & Equipment Hiring",
    shortDescription:
      "Hire tractors and combine harvesters for land preparation, planting, and harvesting — keeping field operations on schedule without the capital cost of ownership.",
    description:
      "Timely field operations are critical to crop performance. ARDA Seeds offers farm mechanisation services including tractor hire for primary and secondary tillage, planting, and spraying, as well as combine harvesters for efficient grain and seed harvesting. Our equipment helps smallholder and commercial farmers complete critical windows on time, reducing yield losses from delayed planting or harvest.",
    heroImage: "/images/Maize field.jpg",
    image: "/images/farm-mechanisation-tractor.png",
    features: [
      "Tractor hire for ploughing, discing, ridging, and planting operations",
      "Combine harvester hire for maize, wheat, sorghum, and other grain crops",
      "Spraying and fertiliser application where equipment is available",
      "Experienced operators provided with hired machinery",
      "Flexible scheduling for peak planting and harvest periods",
      "Serviced and maintained fleet for reliable field performance",
    ],
    benefits: [
      "Avoid large capital outlay on tractors and harvesters",
      "Complete land preparation and harvest within optimal weather windows",
      "Reduce post-harvest losses through timely, mechanised harvesting",
      "Scale operations seasonally without maintaining idle equipment year-round",
    ],
    processSteps: [
      {
        title: "Booking & Scheduling",
        description:
          "Contact our team with your location, hectarage, crop, and required operation. We schedule equipment based on availability and seasonal demand.",
      },
      {
        title: "Site Assessment",
        description:
          "We confirm field access, terrain, and operation requirements to deploy the right tractor or combine for the job.",
      },
      {
        title: "Field Operations",
        description:
          "Equipment and operators arrive on site to complete tillage, planting, or harvesting to agreed specifications and timelines.",
      },
      {
        title: "Completion & Billing",
        description:
          "Work is signed off on completion. Billing is based on hectares covered, hours used, or agreed contract rates.",
      },
    ],
  },
  {
    id: "toll-processing",
    name: "Toll Processing",
    shortDescription:
      "Custom seed cleaning, grading, treatment, and bagging — bring your harvested seed and we process it to commercial quality standards.",
    description:
      "Toll processing allows farmers, outgrowers, and cooperatives to bring harvested seed or grain to ARDA Seeds for professional post-harvest handling. Our processing line includes cleaning, drying, grading, seed treatment, and bagging to meet market and certification requirements. This service is widely used in the seed industry to convert raw harvest into saleable, labelled product without investing in processing infrastructure.",
    heroImage: "/images/Legume seeds.jpg",
    image: "/images/Legume seeds.jpg",
    features: [
      "Seed and grain cleaning — removal of chaff, stones, and broken kernels",
      "Drying to safe moisture levels for storage and germination",
      "Grading by size and density for uniform planting quality",
      "Seed treatment with approved fungicides and insecticides where required",
      "Bagging and labelling to customer or ARDA specifications",
      "Quality testing including germination and purity checks",
    ],
    benefits: [
      "Convert raw harvest into market-ready seed without owning processing plant",
      "Meet certification and buyer quality standards consistently",
      "Extend shelf life through proper drying and treatment",
      "Reduce post-harvest losses from poor storage and handling",
    ],
    processSteps: [
      {
        title: "Intake & Sampling",
        description:
          "Delivered seed or grain is weighed, sampled, and assessed for moisture content, purity, and overall condition before processing.",
      },
      {
        title: "Cleaning & Grading",
        description:
          "Material passes through cleaners, gravity separators, and graders to remove impurities and sort by size and weight.",
      },
      {
        title: "Treatment & Bagging",
        description:
          "Approved seed treatments are applied where specified. Product is bagged in agreed pack sizes with batch labels.",
      },
      {
        title: "Quality Release & Collection",
        description:
          "Final quality checks are completed. Processed seed is released for collection or onward distribution to your customers.",
      },
    ],
  },
  {
    id: "transportation",
    name: "Transportation",
    shortDescription:
      "Reliable truck logistics for seed delivery, outgrower collection, and general agricultural cargo across Zimbabwe.",
    description:
      "ARDA Seeds operates a fleet of trucks to support seed distribution, outgrower seed collection, and client cargo movement. Whether delivering inputs to contracted growers, collecting seed from the field, or moving goods between depots and markets, our transport service helps keep the agricultural supply chain moving efficiently and on time.",
    heroImage: "/images/Wheat field.jpg",
    image: "/images/Wheat field.jpg",
    features: [
      "Seed and input delivery to farms, depots, and retail outlets",
      "Collection of seed and grain from outgrowers and field sites",
      "Bulk and bagged cargo handling for agricultural products",
      "Scheduled and on-demand transport options",
      "Coverage across major farming regions in Zimbabwe",
      "Coordinated logistics for seasonal peak periods",
    ],
    benefits: [
      "Reduce delays in seed and input supply to farmers",
      "Lower post-harvest losses through prompt collection from the field",
      "Outsource logistics without maintaining your own fleet",
      "Reliable movement of goods during critical planting and harvest windows",
    ],
    processSteps: [
      {
        title: "Transport Request",
        description:
          "Submit your pickup and delivery locations, cargo type, volume, and required date. We confirm availability and provide a quote.",
      },
      {
        title: "Scheduling & Dispatch",
        description:
          "A suitable vehicle is assigned and dispatched according to the agreed schedule and route plan.",
      },
      {
        title: "Loading & Transit",
        description:
          "Cargo is loaded securely and transported with care, particularly for bagged seed and sensitive agricultural inputs.",
      },
      {
        title: "Delivery & Confirmation",
        description:
          "Goods are delivered to the destination and receipt confirmed. Documentation is provided for your records.",
      },
    ],
  },
]

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}

/** @deprecated Use `services` instead */
export const outgrowingServices = services.filter((s) => s.id === "outgrowing")
