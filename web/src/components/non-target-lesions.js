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
        create: {type: Boolean},
        date: {},
        _lesionLocations: {type: Array}
    };
    
    constructor() {
        super();
        this._lesionLocations = ["NA", "ASCITIS", "BONE", "LEPTOMENINGEAL DISEASE", "LYMPH NODES", "PLEURAL EFFUSION", "NTL-LOC1", "NTL-LOC2", "NTL-LOC3", "NTL-LOC4", "NTL-LOC5", "NTL-LOC6", "NTL-LOC7", "NTL-LOC8", "NTL-LOC9", "NTL-LOC10"];
    };

    addNonTargetLesion({detail}) {
        console.log("addNonTargetLesion");
        console.log(detail);
        detail.id = "ntl" + this.index++;
        this.lesions = [...this.lesions, detail];
    }

    render(){
        return !this.lesions ? html``: html`
            <app-lesions-table .lesionLocations=${this._lesionLocations} .label=${"Non Target Lesions"} .rows=${this.lesions} ?create=${this.create} prefix="non-target" .date=${this.date}>
                ${!this.create && this.lesions.length > 0 ? html`
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