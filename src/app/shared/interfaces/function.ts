import { Employee } from "./employee";
import { OrgChartTreeNode } from "./org-chart-tree-node";

export interface Function extends OrgChartTreeNode {
    id: string,
    name: string,
    employee: Employee,
    substitution: boolean,
    superrole: Function,
    depth: number,

    isPictureCollectionNode: boolean,
    employeePictures: {name: string, url: string}[], 

    children: Function[],
    selector: number
}
