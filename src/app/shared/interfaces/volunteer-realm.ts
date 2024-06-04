import { Volunteer } from "./volunteer";

export interface VolunteerRealm {
    name: string,
    volunteers: Volunteer[],
    volunteersArray: Volunteer[]
}
