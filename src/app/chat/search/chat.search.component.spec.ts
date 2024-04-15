import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSearchComponent } from './chat.search.component';

describe('SearchComponent', () => {
  let component: ChatSearchComponent;
  let fixture: ComponentFixture<ChatSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
