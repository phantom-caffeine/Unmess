import type {Metadata} from 'next';
import Storefront from '../storefront';
export const metadata:Metadata={title:'Our Philosophy — Unmess',description:'Why Unmess makes calm, flexible systems for beautifully busy minds.'};
export default function PhilosophyPage(){return <Storefront view="philosophy"/>}
