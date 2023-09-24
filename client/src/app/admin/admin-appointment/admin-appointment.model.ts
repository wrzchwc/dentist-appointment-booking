import { User as Base } from '../admin.model';

export interface User extends Base {
    email: string;
    photoUrl: string;
}
