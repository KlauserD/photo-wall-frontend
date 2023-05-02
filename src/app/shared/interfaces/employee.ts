import { OrgChartTreeNode } from "./org-chart-tree-node";

export interface Employee extends OrgChartTreeNode {
    id: string,
    name: string,
    qualification: string,
    function: Employee,
    pictureUrl: string
}
