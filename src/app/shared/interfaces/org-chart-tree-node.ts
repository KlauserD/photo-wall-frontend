export interface OrgChartTreeNode {
    // Node
    children: OrgChartTreeNode[];
    hideChildren?: boolean;
    onClick?: () => void;
    // CSS (used for custom styling of individual nodes)
    cssClass?: string;
    css?: string;

    isSelected: boolean;
}
