import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';
import './measurement-target.js';
import './measurement-non-target.js';
import './measurement-new-lesions.js';
import './measurement-overall.js';
import './alert-modal.js';

class Measurements extends LitElement {
    static properties = {
        patient: {},
        measurements: {},
        layout: {},
        tableSize: {},
        expanded: {},
        userRole: {}    
    };

    modifyMeasurement(measurement){
        console.log(measurement);
        this.dispatchEvent(new CustomEvent('modify-measurement', {
            detail: measurement,
            bubbles: true,
            composed: true,
        }));
    }

    deleteMeasurement(measurement){
        this.dispatchEvent(new CustomEvent('delete-measurement', {
            detail: measurement,
            bubbles: true,
            composed: true,
        }));
    }

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
                ${this.userRole != "admin" ? html`
                    <p style="font: var(--header-2);"></p>`
                : html `
                    <kor-card flat flex-direction="row" style="align-self: center;">
                        <kor-icon button @click=${()=> this.deleteMeasurement(measurement)} size="s" icon="delete" style="height: 28px; align-self: center;"></kor-icon>
                        <kor-icon button @click=${()=> this.modifyMeasurement(measurement)} size="s" icon="edit" style="height: 28px; align-self: center;"></kor-icon>
                    </kor-card>` 
                }
                <app-measurement-target .expanded=${this.expanded} .rows=${this.patient.targetLesions} .measurement=${measurement}></app-measurement-target>
                <p style="font-size: 15px;"></p>
                <app-measurement-non-target .rows=${this.patient.nonTargetLesions} .measurement=${measurement}>
                    <app-measurement-new-lesions .measurement=${measurement}></app-measurement-new-lesions>
                    <app-measurement-overall .measurement=${measurement}></app-measurement-overall>
                </app-measurement-non-target>
            </kor-card>
        `);
    }
}
customElements.define('app-measurements', Measurements);