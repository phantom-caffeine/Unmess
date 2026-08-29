import type {Metadata} from 'next';
import Storefront from '../storefront';
export const metadata:Metadata={title:'Newsletter — Unmess',description:'Thoughtful notes and gentle ideas for a calmer day.'};
export default function NewsletterPage(){return <Storefront view="newsletter"/>}
