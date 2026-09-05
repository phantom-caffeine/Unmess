export const templates = {
  'editors-desk': 'unmess_editors_desk',
  'engineers-command-center': 'unmess_engineers_command_center',
  'second-brain-that-doesnt-suck': 'unmess_second_brain',
  'where-the-fck-is-my-money': 'unmess_money_tracker',
  'everything-bundle': 'unmess_everything_bundle',
};

export const templateLinks = {
  'editors-desk': 'https://sky-rhythm-395.notion.site/The-Editor-s-Desk-3c7b16643a138094b87dd575235c2924?source=copy_link',
  'engineers-command-center': 'https://sky-rhythm-395.notion.site/The-Engineer-s-Command-Center-3d2b16643a13816d8fb0e2d33b1f12be?source=copy_link',
  'second-brain-that-doesnt-suck': 'https://sky-rhythm-395.notion.site/Second-Brain-That-Doesn-t-Suck-3d0b16643a138164a086d57328bdd160?source=copy_link',
  'where-the-fck-is-my-money': 'https://sky-rhythm-395.notion.site/Where-The-F-ck-Is-My-Money-3d2b16643a1381af9b38cc431572dd50?source=copy_link',
};

export function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
