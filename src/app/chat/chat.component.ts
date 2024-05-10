import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatActionsComponent } from './chat.actions.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChatService, Message } from '../chat.service';
import { ChatSearchComponent } from './search/chat.search.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, BrowserAnimationsModule, JsonPipe, FormsModule, ChatActionsComponent, ChatSearchComponent, ],
  animations: [
    trigger("toggleMessage", [
      // state('shown', style({opacity:1, transform:`translateX(0)`})),
      // state('from', style({opacity:0, transform:`translateX(-40px)`})),
      // state('to', style({opacity:0, transform:`translateX(40px)`})),
      transition(':enter', [ // :enter = void => *
        style({opacity:0, transform:`translateX(-20px)`}),
        animate('200ms ease-out', style({opacity:1, transform:`translateX(0)`}))
      ]),
      transition(':leave', [
        // style({opacity:0, transform:`translateX(-40px)`}),
        animate('200ms ease-in', style({opacity:0, transform:`translateX(60px)`}))
      ]),
    ])
  ],
  template: `
  <section class="chat">
    <header class="header _row">
      <h2 class="title">Welcome {{username}}</h2>
    </header>
    <div class="content _scroll">
      <div class="_hack_bottom_scroll">
        @for(message of Chat.messages; track message.id){
          <blockquote class="message _row" [@toggleMessage]>
            <p class="text">
              <span class="user">{{message.author.username}} : </span>
              <span class="body">{{message.body}}</span>
            </p>
            <div class="actions">
              <button type="button"
                class="action"
                [name]="'delete['+$index+']'"
                (click)="delete(message)">X</button>
            </div>
          </blockquote>
        }@empty{
          <blockquote class="message _row empty">
            <p class="text">no messages yet...</p>
          </blockquote>
        }
      </div>
    </div>
    <div class="actions">
      <app-chat-actions name="userActions"
        [message]="newMessage"
        [username]="username"
        [errorMsg]="error['user']"
        (onSend)="send($event)"
        />
    </div>

    <!-- repeat to simulate an other user -->
    <div class="actions">
      <h4>FAKE USER</h4>
      <app-chat-actions name="fakeActions"
        [message]="fakeMessage"
        username="fake"
        [errorMsg]="error['fake']"
        (onSend)="send($event, true)"
        />
    </div>
    <!--
    <pre class="_debug">{{Chat.messages |json}}</pre>
    -->

    <hr>

    <app-chat-search class="search" />
  </section>`,
  styles: `
    .header{
      flex: 1 1 100%;
    }
    .message{
      position:relative;
      scroll-snap-align: end;

      &.empty{
        opacity: 0.6;
        font-style: italic;
        color: gray;
      }
    }
    ._scroll{
      overflow-y: scroll;
      max-height: 60vh;
      // force scroll bottom
      // !!! wrap message so not in reverse ;)
      display: flex;
      flex-direction: column-reverse;
    }
  `
})
export class ChatComponent {

  Auth=inject(AuthService)//.logout
  username = this.Auth.username!

  Chat=inject(ChatService)

  protected newMessage=signal('')
  protected fakeMessage=signal('')
  protected error:{fake?:string, user?:string}={
    fake:undefined,
    user:undefined
  }

  protected send(body:string, fake=false){
    const errorKey = fake && 'fake' || 'user'
    this.error[errorKey] = undefined

    const author = fake
      ? {id:42, username:'Fake'}
      : this.Auth.user!
    this[`${fake ? 'fake' : 'new'}Message`].set('')
    this.Chat.send({author, body})
    .catch(error=>{
      this.error[errorKey] = error
    })
  }

  // for fun
  protected delete(message:Message){
    this.Chat.removeMessage(message)
  }
}
