export interface Turnus {
    id: string,
    name: string,
    year: number,
    month: number,
    active: boolean,
    pictures: {name: string, url: string, role: string}[]
}
