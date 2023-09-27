import { Employee } from "./employee";
import { OrgChartTreeNode } from "./org-chart-tree-node";

export interface Role extends OrgChartTreeNode {
    id: string,
    name: string,
    employee: Employee,
    substitution: boolean,
    superrole: Role,
    depth: number,

    isPictureCollectionNode: boolean,
    employeePictures: {name: string, url: string}[], 

    children: Role[]
}
