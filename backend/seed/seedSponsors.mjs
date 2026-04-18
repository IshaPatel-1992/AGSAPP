import mongoose from "mongoose";
import dotenv from "dotenv";
import Sponsor from "../models/Sponsors.js";

// Load environment variables
dotenv.config();

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI;
// Sponsor data
const sponsors = [
  // Title Sponsors
  { name: "Sonali Jewellers", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764720832/1TitleSPSonaliJw_eaohvz.jpg", website: "https://sonalijewellers.com/", description:"Calgary’s leading family-owned 22kt jeweller since 1976, offering premium gold, diamond, and silver collections with a market-rate buyback guarantee.", type: "Title" },

  // Platinum Sponsors
  { name: "Dhaval Patel - Realtor", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764721842/2PlatinumSPDhavalPatel_hgaoqt.jpg", website:"", description:"A trusted Calgary realtor helping families and investors make confident real estate decisions with expert guidance.", type: "Platinum" },
  { name: "Dr. Kinjal Patel - General Dentist", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764721841/1PlatinumSPKinjalPatel_nifrxw.jpg", website:"", description:"A caring general dentist providing high-quality, comfortable, and patient-focused dental care for all ages.", type: "Platinum" },
  // Gold Sponsors
  { name: "Jayan Naiker - Realtor", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764728113/1GoldSPJayanNaiker_hns3wk.jpg", website:"https://jayannaiker.com/", description:"A knowledgeable Calgary realtor offering reliable support for buying, selling, and investing with confidence.",  type: "Gold" },
  { name: "Kirti Kumar Soni - Accountant", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764728116/2GoldSPKirtiSoni_lzloxc.jpg", website:"", description:"A professional accountant providing accurate tax, bookkeeping, and financial services for individuals and small businesses.", type: "Gold" },
  { name: "Team Elevation", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764728119/3GoldSPTeamElevation_ojg3xd.png", website:"", description:"", type: "Gold" },
  { name: "StanFord Resort", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764728123/4GoldSPStanfordResort_elrkzt.png", website:"", description:"A comfortable and welcoming resort offering quality hospitality and memorable stays for families and travelers.", type: "Gold" },
  { name: "Flexcare Physiotherapy", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764728126/5GoldSPFlexcare_ryitbw.jpg", website:"https://flexcarephysio.ca/", description:"A trusted physiotherapy clinic providing personalized treatment to restore mobility and support long-term wellness.", type: "Gold" },

  // Silver Sponsors
  { name: "Mital Patel - Realtor", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727967/1SilverSPMitalPatel_lu9nep.jpg", website:"", description:"A dedicated realtor delivering friendly, personalized support for buyers and sellers in the Calgary market.", type: "Silver" },
  { name: "Darshan Nashit", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727969/2SilverSPDarshanNasit_p46nca.jpg", website:"", description:"", type: "Silver" },
  { name: "Jainish Parmar - Optician", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727972/3SilverSPJainishParar_yhfmsv.jpg", website:"", description:"A skilled optician offering quality eyewear solutions and personalized eye-care services.", type: "Silver" },
  { name: "Dhrumil Purohit - Realtor", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727975/4SilverSPDhrumilPurohit_yxnttx.jpg", website:"", description:"A reliable realtor focused on helping clients navigate the housing market with clarity and confidence.", type: "Silver" },
  { name: "Kamil Vyas", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727978/5SilverSPKamilVyas_ej4yss.jpg", website:"", description:"", type: "Silver" },
  { name: "iDrive Alberta", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727982/6SilverSPIDriveAB_hhd8pc.jpg", website:"", description:"A professional driving school helping new and experienced drivers build confidence and safe road skills.", type: "Silver" },
  { name: "Ankit Patel - Realtor", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727985/7SilverSPAnkitPatel_l5jiza.jpg", website:"", description:"A customer-focused realtor offering honest advice and strong support throughout every real estate transaction.", type: "Silver" },
  { name: "Ishan BMO", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727988/8SilverSPIshanShah_p7szui.jpg", website:"", description:"A financial representative providing personalized banking guidance and support through BMO.", type: "Silver" },
  { name: "Bombay Spices", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764727991/9SilverSPBombaySp_yubzq1.jpg", website:"", description:"A popular South Asian grocery store offering fresh spices, quality ingredients, and a wide variety of specialty foods.", type: "Silver" },
  { name: "Vikas Patel", logoUrl: "https://res.cloudinary.com/dtjjlf9jr/image/upload/v1764956967/10SilverSPVikasPatel_geenww.jpg", website:"", description:"", type: "Silver" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Delete existing sponsors
    await Sponsor.deleteMany();
    console.log("🗑️ Existing sponsors removed");

    // Insert new sponsors
    await Sponsor.insertMany(sponsors);
    console.log("✅ Sponsors seeded successfully");

    mongoose.disconnect();
    console.log("❎ MongoDB disconnected");
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

seedDB();
