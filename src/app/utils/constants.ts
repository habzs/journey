import { UserRole } from "@/app/models/users";

export const HOME_URL = "/";
export const SIGNIN_URL = "/signin";
export const SIGNUP_URL = "/signup";
export const OPPORTUNITIES_URL = "/opportunities";
export const PROFILE_URL = "/profile";
export const AGENCY_URL = "/agency";
export const MANAGE_OPPORTUNITY_URL = "/manage-opportunity";
export const ADMIN_URL = "/admin";
export const DETAILED_OPPORTUNITY_URL = "/info";

export interface SelectOption {
  label: string;
  value: string;
}

export const userRoleOptions: SelectOption[] = [
  { value: UserRole.Admin, label: UserRole.Admin },
  { value: UserRole.Agency, label: UserRole.Agency },
  { value: UserRole.Volunteer, label: UserRole.Volunteer },
];

export const volunteerStatusOptions: SelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const badgeCategoryOptions: SelectOption[] = [
  { value: "community", label: "Community" },
  { value: "environment", label: "Environment" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "innovation", label: "Innovation" },
  { value: "leadership", label: "Leadership" },
  { value: "social", label: "Social" },
];

export const badgeAchievementLevelOptions: SelectOption[] = [
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "platinum", label: "Platinum" },
];

export const opportunityStatusOptions: SelectOption[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

export const volunteerOptions: SelectOption[] = [
  { value: "animal_welfare", label: "Animal welfare" },
  { value: "environmental_conservation", label: "Environmental conservation" },
  { value: "elderly_care", label: "Elderly care" },
  { value: "childrens_education", label: "Children's education" },
  { value: "homeless_support", label: "Homeless support" },
  { value: "food_banks", label: "Food banks" },
  { value: "disaster_relief", label: "Disaster relief" },
  { value: "mental_health_awareness", label: "Mental health awareness" },
  { value: "youth_mentoring", label: "Youth mentoring" },
  { value: "community_gardening", label: "Community gardening" },
  { value: "literacy_programs", label: "Literacy programs" },
  { value: "refugee_assistance", label: "Refugee assistance" },
  { value: "habitat_restoration", label: "Habitat restoration" },
  { value: "special_needs_support", label: "Special needs support" },
  {
    value: "arts_culture_preservation",
    label: "Arts and culture preservation",
  },
  { value: "womens_empowerment", label: "Women's empowerment" },
  { value: "lgbtq_rights_advocacy", label: "LGBTQ+ rights advocacy" },
  { value: "veterans_support", label: "Veterans support" },
  { value: "substance_abuse_recovery", label: "Substance abuse recovery" },
  { value: "beach_cleanup", label: "Beach cleanup" },
  { value: "wildlife_rehabilitation", label: "Wildlife rehabilitation" },
  {
    value: "domestic_violence_prevention",
    label: "Domestic violence prevention",
  },
  { value: "poverty_alleviation", label: "Poverty alleviation" },
  { value: "healthcare_access", label: "Healthcare access" },
  { value: "digital_literacy_seniors", label: "Digital literacy for seniors" },
  { value: "trail_maintenance", label: "Trail maintenance" },
  {
    value: "sports_coaching_youth",
    label: "Sports coaching for underprivileged youth",
  },
  { value: "hospice_care", label: "Hospice care" },
  { value: "prison_reform", label: "Prison reform and inmate support" },
  { value: "sustainable_agriculture", label: "Sustainable agriculture" },
  { value: "historical_preservation", label: "Historical site preservation" },
  { value: "suicide_prevention", label: "Suicide prevention" },
  { value: "blood_donation", label: "Blood donation drives" },
  { value: "immigrant_integration", label: "Immigrant integration" },
  { value: "renewable_energy", label: "Renewable energy promotion" },
  { value: "cyberbullying_prevention", label: "Cyberbullying prevention" },
  { value: "meals_on_wheels", label: "Meals on Wheels" },
  { value: "urban_beautification", label: "Urban beautification" },
  { value: "voter_registration", label: "Voter registration drives" },
  { value: "marine_conservation", label: "Marine conservation" },
  { value: "fair_housing", label: "Fair housing advocacy" },
  { value: "music_therapy", label: "Music therapy for patients" },
  { value: "reforestation", label: "Reforestation projects" },
  { value: "homelessness_prevention", label: "Homelessness prevention" },
  { value: "adult_education", label: "Adult education" },
  {
    value: "adaptive_sports",
    label: "Adaptive sports for disabled individuals",
  },
  { value: "microfinance", label: "Microfinance initiatives" },
  { value: "therapeutic_riding", label: "Therapeutic horseback riding" },
  {
    value: "archaeological_preservation",
    label: "Archaeological preservation",
  },
  { value: "crisis_hotline", label: "Crisis hotline support" },
];
