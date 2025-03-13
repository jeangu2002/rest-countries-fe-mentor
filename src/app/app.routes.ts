import { ResolveFn, Routes } from '@angular/router';

const resolveTitle: ResolveFn<string> = (route, state) => {
  const countryName = route.paramMap.get('countryName');
  return `${countryName} | Rest countries`;
};

export const routes: Routes = [
  {
    path: '',
    title: 'Rest countries',
    loadComponent: () =>
      import('./components/country-list/country-list.component').then(
        (m) => m.CountryListComponent
      ),
  },
  {
    path: ':countryName',
    title: resolveTitle,
    loadComponent: () =>
      import('./components/country-details/country-details.component').then(
        (m) => m.CountryDetailsComponent
      ),
  },
];
