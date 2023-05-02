import { ZdFsj } from "./zd-fsj"

export interface ZdFsjTurnus {
    id: string,
    name: string,
    year: number,
    month: number
    zdFsjs: ZdFsj[]
}
