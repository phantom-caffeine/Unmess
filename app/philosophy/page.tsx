import type {Metadata} from 'next';
import Storefront from '../storefront';
export const metadata:Metadata={title:'Unmess',description:'Why Unmess makes calm, flexible systems for beautifully busy minds.'};
export default function PhilosophyPage(){return <Storefront view="philosophy"/>}
