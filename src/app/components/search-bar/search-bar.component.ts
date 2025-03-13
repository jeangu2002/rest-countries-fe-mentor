import {
  afterNextRender,
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { debounce, interval } from 'rxjs';
import { CountryService } from '../../services/country-service';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-search-bar',
  imports: [DropdownComponent, FormsModule],
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: NgModel;
  destroyRef = inject(DestroyRef);
  countryService = inject(CountryService);
  regions: { name: string; displayed: boolean }[] = [
    {
      name: 'All',
      displayed: false,
    },
    {
      name: 'Africa',
      displayed: true,
    },
    {
      name: 'America',
      displayed: true,
    },
    {
      name: 'Antarctic',
      displayed: true,
    },
    {
      name: 'Asia',
      displayed: true,
    },
    {
      name: 'Europe',
      displayed: true,
    },
    {
      name: 'Oceania',
      displayed: true,
    },
  ];
  searchValue = '';

  constructor() {
    afterNextRender(() => {});
  }
  ngAfterViewInit(): void {
    const subscription = this.searchInput.valueChanges
      ?.pipe(debounce(() => interval(500)))
      .subscribe(() => {
        const currentValue = this.searchInput.value;
        this.countryService.filterByName(currentValue);
        localStorage.setItem('lastSearch', currentValue);
      });

    this.destroyRef.onDestroy(() => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  regionChange(region: string) {
    setTimeout(() => {
      this.regions = this.regions.map((r) => {
        if (r.name === region) {
          r.displayed = false;
        } else {
          r.displayed = true;
        }
        return r;
      });
    }, 1000);
  }
}
