import BaseLayer from "ol/layer/Base";

export type Layer = {
    groupName: string, 
    name: string;
    title: string;
    visible?: boolean;
    info?: boolean;
    infoText?: string; 
    infoTextTitle?: string; 
    enableSlider?: boolean;
    urlLegend?: string;
    legend?: boolean;
    year?: number,
    layer: BaseLayer;
    
}

export type TreeNode = {
    title: string ;
    key: string;
    children?: TreeNode[]; // sofern children vorhanden sind
    layer?: Layer;
    visible: boolean;      // sofern Angabe zu visible vorhanden ist
    info: boolean;
    infoText?: string;
    infoTextTitle?: string;
    enableSlider?: boolean;
    urlLegend?: string;
    legend?: boolean;
    year?: number,
}