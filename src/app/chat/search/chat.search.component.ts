import { JsonPipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Signal, ViewChild, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, distinctUntilChanged, filter, flatMap, fromEvent, map, startWith } from 'rxjs';
import { Message } from '../../chat.service';
import { ChatService } from './../../chat.service';

@Component({
  selector: 'app-chat-search',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <form action="#search">
      <label for="q">Filter message : </label>
      <input type="text" name="q" id="q" #searchInput>
    </form>
    <pre>{{filtered() | json}}</pre>
  `,
  styles: `

  `
})
export class ChatSearchComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  messages$
  filtered=signal<Message[]>([])

  constructor(Chat:ChatService){
    this.messages$ = toObservable(Chat.messagesSignal)
  }

  ngOnInit() {}
  ngAfterViewInit(){
    const el = this.searchInput.nativeElement
    const search$ = fromEvent<KeyboardEvent>(el, 'keyup')
    // debounce query
    .pipe(
      map(event => event.target as HTMLInputElement),
      startWith(el),
      map(el=>el.value),
      distinctUntilChanged(),
      debounceTime(666),
    )

    // filter messages
    combineLatest([this.messages$, search$])
    .pipe(
      map(([messages, query]) => this.filterMessages(messages, query)),
      filter(results => !!results)
    )
    .subscribe((results)=>{
      console.debug('[search] ', results);
      this.filtered.set(results)
    })
  }

  private filterMessages(messages: Message[], query: string): Message[] {
    console.debug('[search] filter', {messages, query});
    return messages.filter(({body}) => {
      const a = body.toLowerCase()
      const b = query.toLowerCase()
      return a.includes(b)
    });
  }
}
