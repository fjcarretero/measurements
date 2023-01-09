import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import {PatientsDataProvider} from './patients-data-provider.js';
import './components/home.js';
import './components/patient-create.js';
import './components/patient-modal.js';
import './components/patient-detail.js';
import './components/patients-search.js';

class App extends LitElement {

    static properties = {
        newPatient: {},
        patient: {},
        createView: {},
        researchs: {type: Array},
        openModal: {state: true}
    };
    
    constructor() {
        super();
        this.createView = false;
        this.openModal = false;
        this.patientsDataProvider = new PatientsDataProvider();
    };

    toggleCreateView() {
        this.createView = !this.createView;
    }

    async openModalView() {
        console.log("open");
        if(!this.researchs)
            this.researchs = await this.patientsDataProvider.getResearchs();
        this.openModal = true;
    }

    patientClosedListener(){
        this.openModal = false;
    }

    patientAddedListener({detail}){
        this.newPatient = {...detail,
            targetLesions: [],
            nonTargetLesions: []
        }
        this.createView = true;
    }

    patientSelectedListener({detail}) {
        this.patient = detail;
    }
    
    patientCreatedListener({detail}) {
        this.patient = detail;
        this.createView = false;
    }

    backListener() {
        this.patient = null;
    }

    render() {
        return html`
            <kor-page flat="true" scrollable="true">
                <kor-app-bar slot="top" label="App" logo="http://pngimg.com/uploads/microsoft/microsoft_PNG13.png">
                    <kor-button slot="functions" label="Add Patient" @click=${() => this.openModalView()} style="display: flex; align-items: center;"></kor-button>
                </kor-app-bar>
                ${ !this.createView ? html `
                        ${this.renderPatient()}
                    ` : html `
                        <app-patient-create @patient-created=${this.patientCreatedListener} .patient=${this.newPatient} style="max-width: 1024px; width: 100%; margin: 0 auto;"></app-patient-create>` 
                }
                ${ !this.openModal ? html `` : html`
                    <app-patient-modal .researchs=${this.researchs} @patient-added=${this.patientAddedListener} @patient-closed=${this.patientClosedListener}></app-patient-modal>
                `}
            </kor-page>
        `;
    };

    renderPatient(){
        return this.patient ? html`
            <app-patient-detail @back=${this.backListener} .patientId=${this.patient.id} style="max-width: 1024px; width: 100%; margin: 0 auto;"></app-patients-detail>
        `: html`
            <app-patients-search @patientSelected=${this.patientSelectedListener} style="max-width: 1024px; width: 100%; margin: 0 auto;"></app-patients-search>
        `;
    };
}
customElements.define('app-layout', App);