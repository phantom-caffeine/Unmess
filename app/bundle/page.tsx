import type {Metadata} from 'next';
import Storefront from '../storefront';
export const metadata:Metadata={title:'Unmess',description:'Six connected Notion systems for one calmer workspace.'};
export default function BundlePage(){return <Storefront view="bundle"/>}
