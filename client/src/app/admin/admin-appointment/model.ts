import { User as Base } from '../model';

export interface User extends Base {
    email: string;
    photoUrl: string;
}
