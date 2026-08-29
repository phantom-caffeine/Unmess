import type {Metadata} from 'next';
import Storefront from '../storefront';
export const metadata:Metadata={title:'Unmess',description:'Clear answers about Unmess templates, Notion access, delivery, and support.'};
export default function FaqPage(){return <Storefront view="faq"/>}
