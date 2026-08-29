export const templates = {
  'life-planner': 'forma_life_planner',
  'creator-studio': 'forma_creator_studio',
  'second-brain': 'forma_second_brain',
  'study-space': 'forma_study_space',
  'gentle-reset': 'forma_gentle_reset',
  'freelance-hq': 'forma_freelance_hq',
  'everything-bundle': 'forma_everything_bundle',
};

export function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
