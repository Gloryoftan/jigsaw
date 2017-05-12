import {Component, ElementRef, ViewChild} from '@angular/core';
import {PopupRef} from "../../../../../service/popup.service";
import {LoadingService} from "rdk/service/loading.service";

@Component({
    templateUrl: 'loading.html',
    styleUrls: ['loading.scss']
})
export class LoadingDemoComponent {
    @ViewChild('block') block: ElementRef;

    constructor(public loadingService: LoadingService) {
    }

    blockLoading: PopupRef;
    globalLoading: PopupRef;

    popupBlockLoading() {
        if (!this.blockLoading) {
            this.blockLoading = this.loadingService.show(this.block);
        }
    }

    closeBlockLoading() {
        if (this.blockLoading) {
            this.blockLoading.destroy();
            this.blockLoading = null;
        }
    }

    popupGlobalLoading() {
        if (!this.globalLoading) {
            this.globalLoading = this.loadingService.show();
            setTimeout(() => {
                this.closeGlobalLoading();
            }, 3000)
        }
    }

    closeGlobalLoading() {
        if (this.globalLoading) {
            this.globalLoading.destroy();
            this.globalLoading = null;
        }
    }
}
