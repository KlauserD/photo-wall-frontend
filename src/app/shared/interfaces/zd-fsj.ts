import { ZdFsjTurnus } from "./zd-fsj-turnus";

export interface ZdFsj {
    id: string,
    name: string,
    pictureUrl: string,
    assignment: 'zd' | 'fsj',
    assignmentShow: string
}
