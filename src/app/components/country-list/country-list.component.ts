import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CountryService } from '../../services/country-service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-country-list',
  imports: [SearchBarComponent, CommonModule, RouterLink],
  templateUrl: './country-list.component.html',
})
export class CountryListComponent {
  countryService = inject(CountryService);
  countryList = computed(() => this.countryService.loadedCountries());
}
