import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';
import './target-lesions.js';
import './non-target-lesions.js';

class Lesions extends LitElement {
    static properties = {
        targetLesionsStatus: {},
        patient: {},
        suffix: {},
        layout: {},
        tableSize: {},
        expanded: {},
        create: {type: Boolean}
    };

    constructor() {
        super();
    };

    render() {
        return !this.patient ? html`` : html`
            <app-target-lesions .label="${'Target lesions'}" .lesions=${this.patient.targetLesions} .sumDiametersBasal=${this.patient.sumDiametersBasal} ?create=${this.create} .status=${this.targetLesionsStatus}>
            </app-target-lesions>
            <p></p>
            <app-non-target-lesions .label="${'Non-target lesions'}" .lesions=${this.patient.nonTargetLesions} ?create=${this.create}></app-non-target-lesions>
            ${!this.create ? html`
                <kor-table condensed columns="1fr 2fr 1fr 2fr 1fr" style="flex: 1 1 0;">
                    <kor-table-row>
                        <kor-table-cell head grid-cols="5">New Lesions</kor-table-cell>
                    </kor-table-row>
                </kor-table>
                <kor-table condensed columns="1fr 2fr 1fr 2fr 1fr">
                    <kor-table-row>
                        <kor-table-cell head grid-cols="5">Overall Response</kor-table-cell>
                    </kor-table-row>
                </kor-table>
            ` : html``}
        `;
    }

}
customElements.define('app-lesions', Lesions);
