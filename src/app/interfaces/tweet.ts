import { User } from './user';

export interface NewTweet {
    tweet: string;
    _parentTweet?: Tweet;
}



export interface Tweet {
    created_at: string;
    _id: string;
    tweet: string;
    _author: User;
    _parentTweet: Tweet;
}
