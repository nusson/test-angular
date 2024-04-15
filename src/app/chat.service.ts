import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from './auth.service';

export type Message = {
  id:number,
  author:User,
  body: string
}

// default - may be overided by storage
const history:Message[] = [{
  id:-100,
  author: {id:0, username: 'test'},
  body: 'history test'
}]


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // magic : hide signal and expose it through getter/setter as noram vars (but reactive ^^
  // ... did not really test edge cases...
  private messagesSignal = signal<Message[]>([]);
  get messages() {
    return this.messagesSignal();
  }
  set messages(value: Message[]) {
    this.messagesSignal.set(value);
    localStorage.setItem('messages', JSON.stringify(value))
  }
  // track last id
  private _lastId!:number // will start from last one - eg constructor

  /** may fetch messages from storage */
  constructor() {
    const storage = localStorage.getItem('messages')
    this.messages = storage
      ? JSON.parse(storage)
      : history

      // init our _id counter
    this._lastId = this.messages.reduce((max, message) => message.id > max.id ? message : max, this.messages[0])?.id ?? 0;
  }

  async send(msg:Omit<Message, 'id'>){
    const message = {...msg, id:this.createId()}

    const {author, body} = msg
    if(!author.id) throw new Error("must be loggedIn to post messages");
    if(!body) throw new Error("message must not be empty");

    this.messages = ([...this.messages, message])

    //@next use a backend - or better ws:postMessage
    // and use mongoose to store history (remove localstorage)
  }

  // just for fun to filter my array...
  async removeMessage(message:Message){
    this.messages = this.messages.filter((item)=>item.id !== message.id)
  }

  /** cheap uniqId generator */
  private createId(){
    this._lastId++
    return this._lastId
  }
}
