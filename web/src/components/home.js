import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import './patient-detail.js';
import './patients-search.js';

class Home extends LitElement {

    static properties = {
        patient: {}
    };
    
    constructor() {
        super();
    };

    patientSelectedListener({detail}) {
        this.patient = detail;
    }

    backListener() {
        this.patient = null;
    }

    render(){
        return this.patient ? html`
            <app-patient-detail @back=${this.backListener} .patientId=${this.patient.id}></app-patients-detail>
        `: html`
            <app-patients-search @patientSelected=${this.patientSelectedListener}></app-patients-search>
        `;
    };
}

customElements.define('app-home', Home);