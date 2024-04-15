import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChatComponent],
  template: `
  <nav class="nav">
    <button (click)="logout()" class="btn logout">Logout</button>
  </nav>
  <div class="_container">
    <app-chat />
  </div>
  `,
})
export class HomeComponent {

  Auth=inject(AuthService)//.logout
  router=inject(Router)//.logout
  // router!:Router
  constructor(router:Router,authService:AuthService){
    console.debug('[home] ', {router, authService});
    // this.router = router
  }

  protected async logout(){
    await this.Auth.logout()
    this.router.navigate(['login'])
  }
}
