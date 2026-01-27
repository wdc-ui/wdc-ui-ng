import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '@shared/components/footer/footer';
import { Navbar } from '@shared/components/navbar/navbar';

@Component({
  selector: 'wdc-app-layout',
  imports: [RouterOutlet, Footer, Navbar],
  templateUrl: './app-layout.html',
})
export class AppLayout {}
