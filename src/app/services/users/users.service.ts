import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Favourite,User } from 'src/app/interfaces/user';
import { AuthService } from '../auth/auth.service';
import { Tweet } from 'src/app/interfaces/tweet';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // CREATE
  async createUser(user: User) {
    return this.http.post<User>(`${environment.API_URL}/users`, user, this.httpOptions).toPromise();
  }

  // READ
  async getUsers() {
    return this.http.get<User[]>(`${environment.API_URL}/users`).toPromise();
  }

  // UPDATE
  async editUser(user: User) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.put<any>(`${environment.API_URL}/users/${user._id}`, user, {
      headers: headerOptions
    }).toPromise();
  }

  // DELETE
  async deleteUser(userId: string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.delete<any>(`${environment.API_URL}/users/${userId}`, {
      headers: headerOptions
    }).toPromise();
  }
  //ADD TWEET TO FAVOURITES
  async addFavourite(userId: string,favourite: Favourite){
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<any>(`${environment.API_URL}/users/${userId}/new_favourite`,favourite, {
      headers: headerOptions
    }).toPromise();
  }
  //REMOVE TWEET FROM FAVOURITES
  async removeFavourite(userId: string, favourite: Favourite){
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<any>(`${environment.API_URL}/users/${userId}/remove_favourite`,favourite,{
      headers: headerOptions
    }).toPromise();

  }
   


}
