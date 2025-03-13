import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountryService } from '../../services/country-service';

@Component({
  selector: 'app-country-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './country-details.component.html',
})
export class CountryDetailsComponent implements OnInit {
  countryService = inject(CountryService);
  countryName = input.required<string>();
  country = this.countryService.countryDetails;
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const countryName = params.get('countryName')!;
      this.countryService.selectCountry(countryName);
    });
  }
}
