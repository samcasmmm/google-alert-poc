import type { AppConfig, Brief } from "./schema";

/**
 * Starting setup for Emertech Innovations (emertech.io): its Google Alerts feeds
 * and a company brief written from the website. Filled into empty settings until
 * the first save, so anything you change or clear on /settings sticks.
 */
export const PRESET_FEEDS: string[] = [
  "https://www.google.co.in/alerts/feeds/13759890016060511071/13780066080752241371",
  "https://www.google.co.in/alerts/feeds/13759890016060511071/14491977379484144388",
  "https://www.google.co.in/alerts/feeds/13759890016060511071/13122689296776941758",
  "https://www.google.co.in/alerts/feeds/13759890016060511071/8851990712850235863",
  "https://www.google.co.in/alerts/feeds/13759890016060511071/6791325516879749104",
];

export const PRESET_BRIEF: Brief = {
  company: "Emertech Innovations",
  product:
    "Blockchain-backed traceability and compliance platform: Digital Product Passports, QR/NFC product identity, GPS-polygon and satellite deforestation checks, and audit-ready compliance dossiers that plug into ERP/MES/WMS. Also tree-plantation tracking with satellite dMRV for carbon credits, and real-world asset tokenisation.",
  customers:
    "Indian and Asian manufacturers and exporters selling into the EU: rubber and tyres, agri and food, dairy, cotton and textiles, steel, batteries; plus certification bodies, FPOs, forestry/carbon programmes and artisans. Clients include Apollo Tyres, BKT, Control Union, Mahindra Logistics and Sahyadri Farms.",
  competitors: "TraceX, Circulor, Minespider, Sourcemap, Koltiva, Satelligence",
  priorities:
    "Battery Product Passport (EU Battery Regulation, India BPAN); Blockchain-backed certificates; Supply Chain Trace (end-to-end product traceability); CBAM (carbon border emissions reporting); EUDR (EU deforestation export compliance).",
};

/** Priorities text from the first version of this preset; replaced if saved unchanged. */
export const OLD_PRESET_PRIORITIES =
  "EUDR export compliance (rubber, coffee, cocoa, wood, cattle, soy, palm oil); EU Battery Regulation and India BPAN battery passports; ESPR Digital Product Passports for steel and textiles; CBAM emissions reporting; satellite dMRV for carbon credits; winning more enterprise deployments in India and SE Asia.";

const isBlank = (brief: Brief) => Object.values(brief).every((v) => !v.trim());

/** Fills only the parts that are still empty. */
export function withPreset(config: AppConfig): AppConfig {
  return {
    ...config,
    feeds: config.feeds.length ? config.feeds : [...PRESET_FEEDS],
    brief: isBlank(config.brief) ? { ...PRESET_BRIEF } : config.brief,
  };
}
