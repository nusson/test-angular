import { Injectable } from '@angular/core';

// week id system for now
let _incrementalId=0

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user?:User;
  public get username(){
    return this.user?.username
  }
  public get connected(){
    return !!this.user?.username
  }

  constructor() {
    const u = localStorage.getItem('chat-user')
    if (!u) return
    const user = JSON.parse(u)
    this.login(user.username)
  }


  /** extra weak login */
  public async login(username:string){
    if(this.user){
      // already logg - same user just return
      if(this.user?.username === username){
        return Promise.resolve(this.user)
      }

      // different - logout then login
      await this.logout()
    }
    this.user = {
      username,
      id: this.createId()
    }

    localStorage.setItem('chat-user', JSON.stringify(this.user))
    return Promise.resolve(this.user)
  }
  public async logout(){
    delete this.user
    localStorage.removeItem('chat-user')
    return Promise.resolve(undefined)
  }

  private createId(){
    _incrementalId ++
    return _incrementalId
  }
}


export type User = {
  id:number,
  username: string
}
