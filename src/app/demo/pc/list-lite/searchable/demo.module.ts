import {NgModule} from "@angular/core";
import {JigsawListLiteModule} from "jigsaw/public_api";
import {JigsawDemoDescriptionModule} from "app/demo-description/demo-description";
import {ListLiteSearchableDemoComponent} from "./demo.component";

@NgModule({
    imports: [
        JigsawListLiteModule, JigsawDemoDescriptionModule
    ],
    declarations: [ListLiteSearchableDemoComponent],
    exports: [ListLiteSearchableDemoComponent]
})
export class ListLiteSearchableDemoModule {
}
