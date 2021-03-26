import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() currentConversationTitle: any;
  @Input() currentConversationProject: any;
  @Input() currentConversationStatus: any;
  @Input() titleEditable: any;
  @Output() deleteButtonPressed: EventEmitter<any> = new EventEmitter();
  @Output() titleChanged: EventEmitter<any> = new EventEmitter();
  @Output() navigateToHome: EventEmitter<any> = new EventEmitter();
  @Output() publishButtonPressed: EventEmitter<any> = new EventEmitter();
  @Output() unpublishButtonPressed: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
