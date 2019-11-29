import {Tweet} from './tweet';
export interface User {
    email: string;
    password?: string;
    name: string;
    surname: string;
    _id?: string;
    _favourites?: Array<Tweet>;
}

export interface Favourite{
    favourite: string;

}

 
