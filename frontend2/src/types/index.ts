interface ISiteConfig {
  title: string;
  name: string;
  description: string;
  url: string;
  icon: string;
}

interface IListing {
  length: number;
  coverImage: string;
  createdAt: number;
  description: string;
  id: string;
  images: string;
  owner: string;
  postalCode: number;
  price: number;
  region: string;
  tokenId: number;
}

interface IContract {
  listings: IListing[] | null;
  market: any;
  getPurchaseAgreementSigners: any;
  isFetchingListings: boolean;
}

interface IAgreement {
  id: number;
  initiator: string;
  buyer: string;
  estateId: number;
  signersCount: number;
  executed: boolean;
  validSigners: string[];
  signed: boolean;
  listing: any;
}
