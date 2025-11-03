export interface AddressSearchResult {
  lat: number;
  lng: number;
  address: string;
}

export interface AddressApiResponse {
  type: string;
  'found objects': number;
  'returned objects': number;
  results: {
    [key: string]: {
      city: string;
      street: string;
      number: string;
      x: string;
      y: string;
      accuracy: string;
    };
  };
}
