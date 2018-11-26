import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  goto(path: string) {
    this.router.navigate([path]);
  }
}