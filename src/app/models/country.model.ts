export interface Country {
  name: string;
  nativeName: string;
  region: string;
  subRegion: string;
  capital: string;
  population: number;
  languages: string;
  currencies: string;
  topLevelDomain: string;
  borders: string[];
  flags: { alt: string; png: string; svg: string };
}
