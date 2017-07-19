/**
 * Created by 10177553 on 2017/3/28.
 */

import {
    Component, OnInit, ViewChild, Renderer2, ViewContainerRef
} from '@angular/core';
import {AbstractGraphData} from "jigsaw/core/data/graph-data";
import {EchartOptions} from "jigsaw/core/data/echart-types";
import {JigsawGraph} from "jigsaw/component/graph/graph";

@Component({
    template: `<jigsaw-graph [data]="data" width="100%" #graph></jigsaw-graph>`
})

export class BasicGraphComponent implements OnInit {
    data: AbstractGraphData;

    @ViewChild("graph") graph: JigsawGraph;
    
    constructor(public viewContainerRef: ViewContainerRef,
                public renderer: Renderer2) {
    }

    patchOption = {
        title: {
            text: '补丁 - 堆叠区域图'
        }
    }

    ngOnInit() {
        let graphData = new GraphDataDemo();
        this.data = graphData;
        graphData.optionsPatch = this.patchOption;
    }
}

export class GraphDataDemo extends AbstractGraphData {
    protected createChartOptions(): EchartOptions {
        return {
            title: {
                text: '堆叠区域图'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '邮件营销',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '视频广告',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: '直接访问',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: '搜索引擎',
                    type: 'line',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {normal: {}},
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
    }
}

