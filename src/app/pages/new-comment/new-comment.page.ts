import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import {NewTweet, Tweet} from 'src/app/interfaces/tweet';
import { TweetsService } from 'src/app/services/tweets/tweets.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ToastTypes } from 'src/app/enums/toast-types.enum';
import { UniLoaderService } from 'src/app/shared/uniLoader.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.page.html',
  styleUrls: ['./new-comment.page.scss'],
})
export class NewCommentPage implements OnInit {
  me: User;

  newComment = {} as NewTweet;

  tweetToComment: Tweet;

  comments: Tweet[]=[];

  constructor(
    private modalCtrl: ModalController,
    private tweetsService: TweetsService,
    private auth: AuthService,
    private navParams: NavParams,
    private toastService: ToastService,
    private uniLoader: UniLoaderService
  ) { }

  ngOnInit() {
    /**
     * Importo il parametro tweet che rappresenta il tweet da commentare
     */
    this.tweetToComment = this.navParams.get('tweet');
    this.newComment._parentTweet = this.tweetToComment;
    this.getComments();
     //Ottengo i miei dati
     this.me = this.auth.me;
  }

  async dismiss() {

    await this.modalCtrl.dismiss();

  }
  //Get comments
  async getComments(){
    try {

      // Avvio il loader
      await this.uniLoader.show();

      // Popolo il mio array di oggetti 'Tweet' con quanto restituito dalla chiamata API per i commenti
      this.comments = await this.tweetsService.getComments(this.tweetToComment._id);

      // La chiamata è andata a buon fine, dunque rimuovo il loader
      await this.uniLoader.dismiss();

    } catch (err) {

      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }
  }

  //Add new comment
  async comment(){
    try{
       // Avvio il loader
       await this.uniLoader.show();
       // Chiamo la createTweet se l'utente sta creando un nuovo commento
       await this.tweetsService.createTweet(this.newComment);
        // Chiudo la modal
       await this.dismiss();       

       
      

    }catch(err){
       // Nel caso la chiamata vada in errore, mostro l'errore in un toast
       await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });
    }
    // Chiudo il loader
    await this.uniLoader.dismiss();


  }

  isDataInvalid(): boolean {

    if (this.newComment.tweet) {
      return !this.newComment.tweet.length ||
      this.newComment.tweet.length > 120;
    }

    return true;

  }

  canEdit(comment: Tweet): boolean {

    // Controllo che l'autore del tweet coincida col mio utente
    if (comment._author) {
      return comment._author._id === this.auth.me._id;
    }

    return false;

  }

  // Metodo bindato con l'interfaccia in Angular
  getAuthor(comment: Tweet): string {

    if (this.canEdit(comment)) {
      return 'You';
    } else {
      return comment._author.name + ' ' + comment._author.surname;
    }
  }
    /**
   * GESTIONE DEI LIKES
   */
  //ADD
  async addLike(comment: Tweet){
    try{
        await this.tweetsService.addLike(comment);
        // Riaggiorno la mia lista di tweets
        await this.getComments();
      }catch(err){
        // Nel caso la chiamata vada in errore, mostro l'errore in un toast
        await this.toastService.show({
          message: err.message,
          type: ToastTypes.ERROR
        });
  }
  }
  //REMOVE
  async removeLike(comment: Tweet){
    try{
        await this.tweetsService.removeLike(comment);
        // Riaggiorno la mia lista di tweets
        await this.getComments();
      }catch(err){
        // Nel caso la chiamata vada in errore, mostro l'errore in un toast
        await this.toastService.show({
          message: err.message,
          type: ToastTypes.ERROR
        });
  }
  }
  //CONTROLLO SE HO MESSO MI PIACE A UN TWEET SPECIFICO
  liked(comment: Tweet){
    if(comment._likes.indexOf(this.me._id)===-1){
      return false;
    }
    else{
      return true;
    }
  }

}
