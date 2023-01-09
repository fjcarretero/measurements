import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';
import './measurement-target.js';
import './measurement-non-target.js';
import './measurement-new-lesions.js';
import './measurement-overall.js';

class Measurements extends LitElement {
    static properties = {
        patient: {},
        measurements: {},
        layout: {},
        tableSize: {},
        expanded: {}
    };

    static styles = css`
        :host {
            direction: ltr; 
            display: grid; 
            transition: var(--transition-1); 
            margin: 0 !important; 
            max-height: 100%;
        }
        ::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 3px;
            height: 10px;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background-color: rgba(0, 0, 0, .5);
            -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
        }
    `;

    render(){
        return html`
        <kor-grid flat flex-direction="column" columns="none" style="direction: rtl; flex: 2 1; overflow-x: scroll; grid-auto-flow: column; grid-auto-columns: calc(120px - 2rem); grid-template-columns: none;">
            ${this.renderMeasurements()}
        </kot-grid>
        `;

    }


    renderMeasurements() {
        return !this.measurements ? html`` : this.measurements.map(measurement => html`
            <kor-card flat>
                <p></p>
                <app-measurement-target .expanded=${this.expanded} .rows=${this.patient.targetLesions} .measurement=${measurement}></app-measurement-target>
                <p></p>
                <app-measurement-non-target .rows=${this.patient.nonTargetLesions} .measurement=${measurement}>
                    <app-measurement-new-lesions .measurement=${measurement}></app-measurement-new-lesions>
                    <app-measurement-overall .measurement=${measurement}></app-measurement-overall>
                </app-measurement-non-target>
            </kor-card>
        `);
    }
}
customElements.define('app-measurements', Measurements);