import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import "./lesions-table.js";

class NonTargetLesions extends LitElement {

    static properties = {
        label: {},
        lesions: {},
        measurements: {},
        suffix: {},
        layout: {},
        create: {type: Boolean}
    };
    
    constructor() {
        super();
       // this.addEventListener('non-target-lesion-added', this.addNonTargetLesion);
    };

    addNonTargetLesion({detail}) {
        console.log("addNonTargetLesion");
        console.log(detail);
        detail.id = "ntl" + this.index++;
        this.lesions = [...this.lesions, detail];
    }

    render(){
        return !this.lesions ? html``: html`
            <app-lesions-table .label=${"Non Target Lesions"} .rows=${this.lesions} ?create=${this.create} prefix="non-target">
                ${!this.create ? html`
                <kor-table columns="1fr 2fr 1fr 2fr 1fr">
                    <kor-table-row style="grid-template-columns: 1fr 2fr 1fr 2fr 1fr;">
                        <kor-table-cell head grid-cols="5">Response</kor-table-cell>
                    </kor-table-row>
                </kor-table>` : html``}
            </app-lesions-table>
        `
    };
}

customElements.define('app-non-target-lesions', NonTargetLesions);