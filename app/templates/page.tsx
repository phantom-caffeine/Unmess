import type {Metadata} from 'next';
import Storefront from '../storefront';
export const metadata:Metadata={title:'Notion Templates — Unmess',description:'Browse thoughtfully crafted Notion templates for work, life, study, and focus.'};
export default function TemplatesPage(){return <Storefront view="templates"/>}
