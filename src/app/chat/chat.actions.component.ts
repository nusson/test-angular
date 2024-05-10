import { animate, state, style, transition, trigger } from '@angular/animations';
// import { , JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChatService, Message } from '../chat.service';

@Component({
  selector: 'app-chat-actions',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form action="#" class="form" (ngSubmit)="send()">
      <div class="row">
        <label for="message" class="label">{{username}} : </label>
        <input type="text" id="message" name="message" [(ngModel)]="message" />
        <input type="submit" class="submit" value="Send"/>
      </div>
      @if(errorMsg){
        <p class="error">{{errorMsg}}</p>
      }
    </form>`,
})
export class ChatActionsComponent {
  @Input()
  message=signal('')
  @Input()
  username:string=''
  @Input()
  errorMsg?:string=''

  @Output() onSend = new EventEmitter<string>();
  protected send(){
    this.onSend.emit(this.message()!)
  }
}
