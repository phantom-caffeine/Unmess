import type {Metadata} from 'next';
import Storefront from '../storefront';
export const metadata:Metadata={title:'Unmess',description:'See how the Unmess community creates more space and less friction.'};
export default function ReviewsPage(){return <Storefront view="reviews"/>}
