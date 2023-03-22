import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import {PatientsDataProvider} from './patients-data-provider.js';
import './components/patient-create.js';
import './components/patient-modal.js';
import './components/patient-detail.js';
import './components/patients-search.js';
import './components/notifications.js';

class App extends LitElement {

    static properties = {
        newPatient: {},
        patient: {},
        createView: {},
        researchs: {type: Array},
        role: {},
        openModal: {state: true},
        targetLesionIndex: {state: true},
        nonTargetLesionIndex:{state: true},
        _notifications: {type: Array, state: true}
    };
    
    constructor() {
        super();
        this.createView = false;
        this.openModal = false;
        this.nonTargetLesionIndex = 1;
        this.targetLesionIndex = 1;
        this._notifications = [];
        this.addEventListener("notification", this.addNotification)
        this.patientsDataProvider = new PatientsDataProvider();
        this.getResearchs();
        this.addEventListener('target-lesion-added', this.addTargetLesion);
        this.addEventListener('non-target-lesion-added', this.addNonTargetLesion);
        this.addEventListener('target-lesion-deleted', this.deleteTargetLesion);
        this.addEventListener('non-target-lesion-deleted', this.deleteNonTargetLesion);
        this.addEventListener('patient-lesions-deleted', this.deleteLesions);
        //this.addEventListener('target-lesion-modified', this.modifyTargetLesion);
        //this.addEventListener('non-target-lesion-modified', this.modifyNonTargetLesion);

    };

    disconnectedCallback(){
        super.disconnectedCallback()
        console.log("disconnectedCallback");
        this.newPatient = {};
        this.targetLesionIndex = 1
        this.nonTargetLesionIndex = 1
    }

    addTargetLesion({detail}) {
        console.log("addTargetLesion");
        console.log(detail);
        console.log(this.targetLesionIndex);
        detail.id = 'tl' + this.targetLesionIndex++;
        console.log(detail);
        this.newPatient = {
            ...this.newPatient, 
            targetLesions: [...this.newPatient.targetLesions, detail]
        }
        console.log(this.patient);
    }

    addNonTargetLesion({detail}) {
        console.log("addNonTargetLesion");
        console.log(detail);
        detail.id = 'ntl' + this.nonTargetLesionIndex++;
        this.newPatient = {
            ...this.newPatient, 
            nonTargetLesions: [...this.newPatient.nonTargetLesions, detail]
        }
    }

    deleteTargetLesion({detail}) {
        console.log("deleteTargetLesion");
        console.log(detail);
        this.targetLesionIndex--;
        this.newPatient = {
            ...this.newPatient, 
            targetLesions: this.newPatient.targetLesions.filter(lesion => lesion.id != detail)
        }
    }

    deleteNonTargetLesion({detail}) {
        console.log("deleteNonTargetLesion");
        console.log(detail);
        this.nonTargetLesionIndex--;
        this.newPatient = {
            ...this.newPatient, 
            nonTargetLesions: this.newPatient.nonTargetLesions.filter(lesion => lesion.id != detail)
        }
    }

    deleteLesions({detail}) {
        console.log("deleteLesions");
        this.newPatient = {
            ...this.newPatient, 
            targetLesions: [],
            nonTargetLesions: []
        }
    }

    // async modifyTargetLesion({detail}) {
    //     console.log("modifyTargetLesion");
    //     console.log(detail);
    //     console.log(this.patient.id);
    //     let response = await this.patientsDataProvider.modifyTargetLesion(this.patient.id, detail.id, detail);
    //     const id = this.patient.id;
    //     this.requestUpdate("patient", this.patient);
    //     //this.patient = {...this.patient, id: id};
    // }

    // async modifyNonTargetLesion({detail}) {
    //     console.log("modifyNonTargetLesion");
    //     console.log(detail);
    //     let response = await this.patientsDataProvider.modifyNonTargetLesion(this.patient.id, detail.id, detail);
        
    //     this.patient = {...this.patientsDataProvider.getPatientById(this.patient.id)};
    // }

    addNotification({detail}) {
        this._notifications = [...this._notifications, detail];
        setTimeout(() => {this._notifications = this._notifications.filter((notification) => notification != detail)}, 5000);
    }

    toggleCreateView() {
        this.createView = !this.createView;
    }

    async getResearchs() {
        let response = await this.patientsDataProvider.getResearchs();
        this.researchs = await response.json();
        this.role = response.headers.get('x-role');
    }

    openModalView() {
        if(!this.researchs)
            this.getResearchs();
        this.newpatient = {};
        this.targetLesionIndex = 1
        this.nonTargetLesionIndex = 1
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
        console.log("patientAddedListener");

        console.log(this.newPatient);
        this.createView = true;
        this.openModal = false;
    }

    patientSelectedListener({detail}) {
        this.patient = detail;
    }
    
    patientCreatedListener({detail}) {
        this.patient = detail;
        this.createView = false;
        this.openModal = false;
    }

    patientCancelledListener(){
        this.createView = false;
        this.openModal = false; 
    }

    backListener() {
        this.patient = null;
    }

    render() {
        return html`
            <kor-page flat="true" scrollable="true" flex-direction="column">
                <kor-app-bar slot="top" label="App" logo="./images/icons8-pill-48.png">
                    <kor-button slot="functions" label="Add Patient" @click=${() => this.openModalView()} ?disabled=${this.createView} style="display: flex; align-items: center;"></kor-button>
                </kor-app-bar>
                <app-notifications .notifications=${this._notifications} style="max-width: 1024px; width: 100%; margin: 0 auto;"></app-notifications>
                ${ !this.createView ? html `
                        ${this.renderPatient()}
                    ` : html `
                        <app-patient-create @patient-created=${this.patientCreatedListener} @patient-cancelled=${this.patientCancelledListener} .patient=${this.newPatient} style="max-width: 1024px; width: 100%; margin: 0 auto;"></app-patient-create>` 
                }
                ${ !this.openModal ? html `` : html`
                    <app-patient-modal .researchs=${this.researchs} @patient-added=${this.patientAddedListener} @patient-closed=${this.patientClosedListener}></app-patient-modal>
                `}
            </kor-page>
        `;
    };

    renderPatient(){
        return this.patient ? html`
            <app-patient-detail @back=${this.backListener} .patientId=${this.patient.id} .userRole=${this.role} style="max-width: 1024px; width: 100%; margin: 0 auto;"></app-patients-detail>
        `: html`
            <app-patients-search @patientSelected=${this.patientSelectedListener} .researchs=${this.researchs} style="max-width: 1024px; width: 100%; margin: 0 auto;"></app-patients-search>
        `;
    };
}
customElements.define('app-layout', App);