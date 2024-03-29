import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tweet, NewTweet } from 'src/app/interfaces/tweet';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {

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
  async createTweet(newTweet: NewTweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<Tweet>(`${environment.API_URL}/tweets/`, newTweet, {
      headers: headerOptions
    }).toPromise();
  }

  // READ
  async getTweets() {
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets`).toPromise();
  }

  //GET COMMENTS
  async getComments(tweetId: string) {
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets/${tweetId}/comments`).toPromise();
  }


  // UPDATE
  async editTweet(tweet: Tweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.put<any>(`${environment.API_URL}/tweets/${tweet._id}`, tweet, {
      headers: headerOptions
    }).toPromise();
  }

  // DELETE
  async deleteTweet(tweetId: string) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.delete<any>(`${environment.API_URL}/tweets/${tweetId}`, {
      headers: headerOptions
    }).toPromise();
  }

  //ADD LIKE (ricordare queste virgolette '' come secondo argomento della richiesta http ... stavo impazzendo!!!!)
   async addLike(tweet: Tweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<any>(`${environment.API_URL}/tweets/${tweet._id}/new_like`,'', {
      headers: headerOptions
    }).toPromise();
  }
  //REMOVE LIKE
  async removeLike(tweet: Tweet) {
    const headerOptions = this.httpOptions.headers.append('Authorization', `Bearer ${this.auth.userToken}`);
    return this.http.post<any>(`${environment.API_URL}/tweets/${tweet._id}/remove_like`,'', {
      headers: headerOptions
    }).toPromise();
  }
  // CERCA HASHTAG
  async getHashtag(hashtag: string) {
    return this.http.get<Tweet[]>(`${environment.API_URL}/tweets/${hashtag}/search`).toPromise();
  }

}
