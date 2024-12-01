import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { LoginPayloadInterface, LoginSuccessResponse } from '../models/login.model';
import { environment } from '../../../environments/environments';
import { LoggedProfile } from '../models/profile.model';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url =  environment.url;
  private urlAuth =  this.url+'/auth';
  private token!: string;
  currentUser: WritableSignal<LoggedProfile | undefined | null> = signal(undefined);

  constructor(private http: HttpClient, private router: Router) {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      this.logout();
      return;
    }

    this.token = accessToken;
  }

  async login(loginPayload: LoginPayloadInterface): Promise<LoggedProfile>{
    const loginResp: LoginSuccessResponse = await firstValueFrom(this._login(loginPayload));
    this.token = loginResp.access_token;
    localStorage.setItem('access_token',this.token);
    return await firstValueFrom(this.getProfile());
  }

  private _login(loginPayload: LoginPayloadInterface): Observable<LoginSuccessResponse>{
    return this.http.post<LoginSuccessResponse>(this.urlAuth+'/login', loginPayload);
  }

  navigateLogin(){
    this.router.navigate(['auth/login'])
  }

  logout(){
    localStorage.removeItem('access_token');
    this.currentUser.set(null);
    this.navigateLogin();
  }

  getToken(){
    return this.token;
  }
  getProfile(): Observable<LoggedProfile>{
    return this.http.get<LoggedProfile>(this.urlAuth+'/profile').pipe(
      tap({
        next: (profile) => {
          this.currentUser.set(profile);
        },
        error: (err) => {
          console.log({err})
          this.logout();
        }
      })
    );
  }
}
