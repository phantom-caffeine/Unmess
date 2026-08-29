export const templates = {
  'life-planner': 'unmess_life_planner',
  'creator-studio': 'unmess_creator_studio',
  'second-brain': 'unmess_second_brain',
  'study-space': 'unmess_study_space',
  'gentle-reset': 'unmess_gentle_reset',
  'freelance-hq': 'unmess_freelance_hq',
  'everything-bundle': 'unmess_everything_bundle',
};

export function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
