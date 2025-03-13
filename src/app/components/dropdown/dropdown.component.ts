import {
  Component,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { CountryService } from '../../services/country-service';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent implements OnDestroy {
  ngOnDestroy(): void {
    this.expanded.set(false);
  }
  selectedRegion = signal('Filter by region');
  regionChange = output<string>();
  regions = input.required<{ name: string; displayed: boolean }[]>();
  expanded = signal(false);
  countryService = inject(CountryService);

  onFilterClick() {
    this.expanded.set(!this.expanded());
  }

  selectRegion(region: string) {
    region === 'All'
      ? this.selectedRegion.set('Filter by region')
      : this.selectedRegion.set(region);
    this.expanded.set(!this.expanded());
    this.countryService.filterByRegion(region);
    this.regionChange.emit(region);
  }
}
