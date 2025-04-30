import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';
  @Input() message: string = '';
  @Input() dismissible: boolean = true;
  show: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  close(): void {
    this.show = false;
  }
}