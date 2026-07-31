import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'NotFoundComponent',
  imports: [RouterLink, MatButton],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss',
})
export class NotFoundComponent {}
