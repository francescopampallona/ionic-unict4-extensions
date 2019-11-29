import { Component, OnInit } from '@angular/core';
import { Tweet } from 'src/app/interfaces/tweet';
import { TweetsService } from 'src/app/services/tweets/tweets.service';
import {UsersService} from 'src/app/services/users/users.service';
import { ModalController } from '@ionic/angular';
import { NewTweetPage } from '../new-tweet/new-tweet.page';
import {NewCommentPage} from '../new-comment/new-comment.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UniLoaderService } from 'src/app/shared/uniLoader.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ToastTypes } from 'src/app/enums/toast-types.enum';
import {Favourite, User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.page.html',
  styleUrls: ['./tweets.page.scss'],
})
export class TweetsPage implements OnInit {
  me: User;
  tweets: Tweet[] = [];
  hash: string = "";
  

  constructor(
    private usersService: UsersService,
    private tweetsService: TweetsService,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private uniLoader: UniLoaderService,
    private toastService: ToastService
  ) { }

  async ngOnInit() {

    // Quando carico la pagina, riempio il mio array di Tweets
    await this.getTweets();
    //Ottengo i miei dati
    this.me = this.auth.me;
     

  }

  async getTweets() {

    try {

      // Avvio il loader
      await this.uniLoader.show();

      // Popolo il mio array di oggetti 'Tweet' con quanto restituito dalla chiamata API
      this.tweets = await this.tweetsService.getTweets();

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

  async createOrEditTweet(tweet?: Tweet) {

    /*
        Creo una modal (assegnandola ad una variabile)
        per permettere all'utente di scrivere un nuovo tweet
    */
    const modal = await this.modalCtrl.create({
      component: NewTweetPage,
      componentProps: {
        tweet
      } // Passo il parametro tweet. Se non disponibile, rimane undefined.
    });

    /*
        Quando l'utente chiude la modal ( modal.onDidDismiss() ),
        aggiorno il mio array di tweets
    */
    modal.onDidDismiss()
    .then(async () => {

      // Aggiorno la mia lista di tweet, per importare le ultime modifiche apportate dall'utente
      await this.getTweets();

      // La chiamata è andata a buon fine, dunque rimuovo il loader
      await this.uniLoader.dismiss();

    });

    // Visualizzo la modal
    return await modal.present();

  }

  async deleteTweet(tweet: Tweet) {

    try {

      // Mostro il loader
      await this.uniLoader.show();

      // Cancello il mio tweet
      await this.tweetsService.deleteTweet(tweet._id);

      // Riaggiorno la mia lista di tweets
      await this.getTweets();

      // Mostro un toast di conferma
      await this.toastService.show({
        message: 'Your tweet was deleted successfully!',
        type: ToastTypes.SUCCESS
      });

    } catch (err) {

      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }

    // Chiudo il loader
    await this.uniLoader.dismiss();

  }

  canEdit(tweet: Tweet): boolean {

    // Controllo che l'autore del tweet coincida col mio utente
    if (tweet._author) {
      return tweet._author._id === this.auth.me._id;
    }

    return false;

  }

  // Metodo bindato con l'interfaccia in Angular
  getAuthor(tweet: Tweet): string {

    if (this.canEdit(tweet)) {
      return 'You';
    } else {
      return tweet._author.name + ' ' + tweet._author.surname;
    }

    /* ------- UNA FORMA PIÚ SINTETICA PER SCRIVERE STA FUNZIONE: -------

      return this.canEdit(tweet) ? 'You' : `${tweet._author.name} ${tweet._author.surname}`;

    */

  }
  // NUOVO COMMENTO
  async createComment(tweet: Tweet) {

    /*
        Creo una modal (assegnandola ad una variabile)
        per permettere all'utente di scrivere un nuovo commento
    */
    const modal1 = await this.modalCtrl.create({
      component: NewCommentPage,
      componentProps: {
        tweet
      } // Passo il parametro tweet che deve essere sempre disponibile
    });

    /*
        Quando l'utente chiude la modal ( modal.onDidDismiss() ),
        aggiorno il mio array di tweets
    */
    modal1.onDidDismiss()
    .then(async () => {

      // Aggiorno la mia lista di tweet, per importare le ultime modifiche apportate dall'utente
      await this.getTweets();

      // La chiamata è andata a buon fine, dunque rimuovo il loader
      await this.uniLoader.dismiss();

    });

    // Visualizzo la modal
    return await modal1.present();

  }

  /**
   * GESTIONE DEI LIKES
   */
  //ADD
  async addLike(tweet: Tweet){
    try{
        await this.tweetsService.addLike(tweet);
        // Riaggiorno la mia lista di tweets
        await this.getTweets();
      }catch(err){
        // Nel caso la chiamata vada in errore, mostro l'errore in un toast
        await this.toastService.show({
          message: err.message,
          type: ToastTypes.ERROR
        });
  }
  }
  //REMOVE
  async removeLike(tweet: Tweet){
    try{
        await this.tweetsService.removeLike(tweet);
        // Riaggiorno la mia lista di tweets
        await this.getTweets();
      }catch(err){
        // Nel caso la chiamata vada in errore, mostro l'errore in un toast
        await this.toastService.show({
          message: err.message,
          type: ToastTypes.ERROR
        });
  }
  }
  //CONTROLLO SE HO MESSO MI PIACE A UN TWEET SPECIFICO
  liked(tweet: Tweet){
    if(tweet._likes.indexOf(this.me._id)===-1){
      return false;
    }
    else{
      return true;
    }
  }
  
  /**
   * GESTIONE DEI PREFERITI
   */
  //OTTENGO LA MIA LISTA DI PREFERITI
  
  //ADD
  async addFavourite(tweet: Tweet){
    try{
      const favourite: Favourite = {"favourite": tweet._id};
      await this.usersService.addFavourite(this.me._id,favourite);
      // Riaggiorno la mia lista di preferiti
      this.me= await this.auth.getMe();
    }catch(err){
      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });
    }
  }

  //REMOVE
  async removeFavourite(tweet: Tweet){
    try{
      const favourite: Favourite = {"favourite": tweet._id};
      await this.usersService.removeFavourite(this.me._id, favourite);
      // Riaggiorno la mia lista di preferiti
      this.me = await this.auth.getMe();
    }catch(err){
      // Nel caso la chiamata vada in errore, mostro l'errore in un toast
      await this.toastService.show({
        message: err.message,
        type: ToastTypes.ERROR
      });

    }
  }

  //CONTROLLO SE UN TWEET SPECIFICO FA PARTE DELLA MIA LISTA PREFERITI
  isFavourite(tweet: Tweet){
    
    for (var i=0; i < this.me._favourites.length; i++) {
      if (this.me._favourites[i]._id === tweet._id) {
          return true;
        }
    }
    
      return false;
    

  }
  //MOSTRA SOLTANTO I PREFERITI
  showFavourites(){
   
    this.tweets = this.me._favourites;
  }

  async search() {
    if(this.hash != '') {
      try {

        let tmp: string = this.hash;

        // Avvio il loader
        await this.uniLoader.show();

        // Popolo il mio array di oggetti 'Tweet' con quanto restituito dalla chiamata API
        while(!tmp.search('#'))
          tmp = tmp.replace('#', "");
        this.tweets = await this.tweetsService.getHashtag(tmp);

        // La chiamata è andata a buon fine, dunque rimuovo il loader
        await this.uniLoader.dismiss();

      } catch (err) {

        // Nel caso la chiamata vada in errore, mostro l'errore in un toast
        await this.toastService.show({
          message: err.message,
          type: ToastTypes.ERROR
        });

      }
    } else {
      await this.getTweets();
    }
  }



}
