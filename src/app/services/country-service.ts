import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  readonly restApiBaseUrl = 'https://restcountries.com/v3.1';
  http: HttpClient = inject(HttpClient);
  private countries = signal<Partial<Country | null>[]>([]);
  private countryCodes: { name: string; code: string }[] = [];
  private destroyRef = inject(DestroyRef);
  private countryCache: Partial<Country | null>[] = [];
  private selectedRegion = '';
  private selectedCountry = signal<Partial<Country | null | undefined>>(null);
  countryDetails = this.selectedCountry.asReadonly();

  loadedCountries = this.countries.asReadonly();

  selectCountry(countryName: string) {
    const country = this.countryCache.find(
      (c) => c?.name?.toLocaleLowerCase() === countryName?.toLowerCase()
    );
    this.selectedCountry.set(country);
  }

  loadCountryCodes(): void {
    const subscription = this.http
      .get(`${this.restApiBaseUrl}/all?fields=name,cca3`)
      .pipe(
        map((data) => {
          return (data as Array<any>).map((country) => ({
            name: country?.name?.common,
            code: country.cca3,
          }));
        })
      )
      .subscribe((result) => {
        this.countryCodes = result;
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  loadCountries() {
    this.http
      .get(
        `${this.restApiBaseUrl}/all?fields=name,capital,currencies,borders,languages,population,region,flags,tld,languages,subregion`
      )
      .pipe(map((data) => (<any[]>data).map(this.mapCountry.bind(this))))
      .subscribe({
        next: (countries) => {
          this.countries.set(countries);
          this.countryCache = countries;
        },
      });
  }

  filterByRegion(region: string) {
    if (this.selectedRegion === region) return;
    console.log('region:', region);
    if (region.toLocaleLowerCase() === 'all') {
      this.countries.set(this.countryCache);
    } else {
      this.countries.set(
        this.countryCache.filter((c) => c?.region?.includes(region))
      );
    }
    this.selectedRegion = region;
  }

  filterByName(name: string) {
    if (!name || !name.trim()) {
      this.countries.set(this.countryCache);
    } else {
      this.selectedRegion && this.selectedRegion !== 'All'
        ? this.countries.set(
            this.countryCache.filter(
              (c) =>
                c?.name?.toLowerCase().includes(name?.toLowerCase()) &&
                c?.region?.includes(this.selectedRegion)
            )
          )
        : this.countries.set(
            this.countryCache.filter((c) =>
              c?.name?.toLowerCase().includes(name?.toLowerCase())
            )
          );
    }
  }

  mapCountry(country: any): Partial<Country | null> {
    if (!country) {
      return null;
    }

    const mappedCountry: Partial<Country> = {};
    try {
      mappedCountry.name = country.name?.common;
      mappedCountry.nativeName = Object.entries(country.name.nativeName ?? {})
        .map((arr: any[]) => arr[1]?.official)
        .shift();
      mappedCountry.region = country.region;
      mappedCountry.capital = country.capital?.join(', ');
      if (country.currencies) {
        mappedCountry.currencies = Object.entries(country.currencies ?? {})
          .map((arr: any[]) => arr[1])
          .map((curr) => curr.symbol)
          .join(', ');
      }
      mappedCountry.population = country.population;
      mappedCountry.flags = country.flags;
      mappedCountry.borders = (<string[]>country.borders)?.map(
        (border) => this.countryCodes.find((c) => c.code === border)?.name ?? ''
      );
      mappedCountry.topLevelDomain = country.tld;
      mappedCountry.subRegion = country.subregion;
      mappedCountry.languages = Object.entries(country.languages ?? {})
        .map((arr) => arr[0])
        .join(', ');
    } catch (error) {
      console.error(error);
    }
    return mappedCountry;
  }
}
