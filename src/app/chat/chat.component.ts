import { animate, state, style, transition, trigger } from '@angular/animations';
import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChatService, Message } from '../chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [JsonPipe, FormsModule],
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
      <span class="date">date here</span>
    </header>
    <div class="content">
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
    <div class="actions">
      <form action="#" class="form" (ngSubmit)="send(newMessage)">
        <div class="row">
          <label for="message" class="label">{{username}} : </label>
          <input type="text" id="message" name="message" [(ngModel)]="newMessage" />
          <input type="submit" class="submit" value="Send"/>
        </div>
        @if(error['user']){
          <p class="error">{{error['user']}}</p>
        }
      </form>
    </div>

    <!-- repeat to simulate an other user -->
    <div class="actions">
      <h4>FAKE USER</h4>
      <form action="#" class="form" (ngSubmit)="send(fakeNewMessage, true)">
        <div class="row">
          <label for="message" class="label">Fake : </label>
          <input type="text" id="message" name="message" [(ngModel)]="fakeNewMessage" />
          <input type="submit" class="submit" value="Send"/>
        </div>
        @if(error['fake']){
          <p class="error">{{error['fake']}}</p>
        }
      </form>
    </div>
    <pre class="_debug">{{Chat.messages |json}}</pre>
  </section>`,
  styles: `
    .header{
      flex: 1 1 100%;
    }
    .message{
      position:relative;

      &.empty{
        opacity: 0.6;
        font-style: italic;
        color: gray;
      }
    }
  `
})
export class ChatComponent {

  Auth=inject(AuthService)//.logout
  username = this.Auth.username

  Chat=inject(ChatService)

  protected newMessage:string=''
  protected fakeNewMessage:string=''
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
    this[`${fake ? 'fakeN' : 'n'}ewMessage`] = ''
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
