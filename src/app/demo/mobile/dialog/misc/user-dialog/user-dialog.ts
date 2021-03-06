import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {DialogBase, JigsawMobileDialog} from "jigsaw/mobile_public_api";

@Component({
    templateUrl: 'user-dialog.html',
    styleUrls: ['./user-dialog.css']
})
export class UserDialogComponent extends DialogBase implements AfterViewInit {
    // 这个变量是父类所需，就照着这么写就行啦
    @ViewChild(JigsawMobileDialog) public dialog: JigsawMobileDialog;

    gotoGithub() {
        window.open('https://github.com/rdkmaster/jigsaw', '_blank');
    }

    ngAfterViewInit() {
        console.log(`input data is: ${this.initData.inputData}`);
    }
}
