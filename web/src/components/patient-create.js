import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import {PatientsDataProvider} from '../patients-data-provider.js';

class PatientCreate extends LitElement {

    static properties = {
        patient: {},
        _patient: {state: true},
        targetLesionIndex: {state: true},
        nonTargetLesionIndex:{state: true},
        targetLesionsStatus: {state: true},
        _showAlert: {type: Boolean, state: true}
    };
    
    constructor() {
        super();
        this.nonTargetLesionIndex = 1;
        this.targetLesionIndex = 1;
        this.patientsDataProvider = new PatientsDataProvider();
        this.patient = {
            targetLesions: [],
            nonTargetLesions: []
        };
        this._showAlert = false;
        this.addEventListener('target-lesion-added', this.addTargetLesion);
        this.addEventListener('non-target-lesion-added', this.addNonTargetLesion);
        this.addEventListener('target-lesion-deleted', this.deleteTargetLesion);
        this.addEventListener('non-target-lesion-deleted', this.deleteNonTargetLesion);
    };

    update(changed) {
        super.update(changed);
        console.log("changed");
        console.log(changed);
        if (changed.has('newPatient')) {
            this._patient = {...this.patient,
                "research": ""
            }
        }
    }

    disconnectedCallback(){
        super.disconnectedCallback()
        console.log("disconnectedCallback");
        this.patient = {};
        this.nonTargetLesionIndex = 1
        this.targetLesionsStatus = 1
        this._showAlert = false;
    }

    changeResearchIdValue({detail}) {
        this.patient.research = detail;
    }

    changePatientIdValue({detail}){
        this.patient.id = detail;
    }

    addTargetLesion({detail}) {
        console.log("addTargetLesion");
        console.log(detail);
        detail.id = 'tl' + this.targetLesionIndex++;
        this.patient = {
            ...this.patient, 
            targetLesions: [...this.patient.targetLesions, detail]
        }
    }

    addNonTargetLesion({detail}) {
        console.log("addNonTargetLesion");
        console.log(detail);
        detail.id = 'ntl' + this.nonTargetLesionIndex++;
        this.patient = {
            ...this.patient, 
            nonTargetLesions: [...this.patient.nonTargetLesions, detail]
        }
    }

    deleteTargetLesion({detail}) {
        console.log("deleteTargetLesion");
        console.log(detail);
        this.targetLesionIndex--;
        this.patient = {
            ...this.patient, 
            targetLesions: this.patient.targetLesions.filter(lesion => lesion.id != detail)
        }
    }

    deleteNonTargetLesion({detail}) {
        console.log("deleteNonTargetLesion");
        console.log(detail);
        this.nonTargetLesionIndex--;
        this.patient = {
            ...this.patient, 
            nonTargetLesions: this.patient.nonTargetLesions.filter(lesion => lesion.id != detail)
        }
    }

    deleteData() {
        this.patient = {
            ...this.patient,
            targetLesions: [],
            nonTargetLesions: []
        };
    }

    async createPatient() {
        if(this.validateForm()){
            let result = await this.patientsDataProvider.postPatients(this.patient);
            this.dispatchEvent(new CustomEvent('patient-created', {
                detail: this.patient,
                bubbles: true,
                composed: true,
              }))
        }
    }

    validateForm() {
        return this.validateTargetLesions();
    }

    validateTargetLesions(){
        if (this.patient.targetLesions?.length == 0) {
            this.targetLesionsStatus = "error";
            return false;
        } else {
            this.targetLesionsStatus = null;
            return true;
        }
        
    }

    dispatchBack(){
        this._showAlert = true;
    }

    dispatchCancelAlert() {
        this._showAlert = false;
    }

    dispatchContinueAlert () {
        this.dispatchEvent(new CustomEvent('patient-cancelled', {
            detail: '',
            bubbles: true,
            composed: true,
        }));
        this._showAlert = false;
    }

    render(){
        return html`
            <kor-card flat>
                <app-patient @researchId-changed=${this.changeResearchIdValue} @patientId-changed=${this.changePatientIdValue} .patient=${this.patient} create></app-patient>
                <kor-tabs>
                    <kor-tab-item label="RECIST" active></kor-tab-item>
                </kor-tabs>
                <kor-card flex-direction="row" flat>
                    <app-lesions .patient=${this.patient} create .targetLesionsStatus=${this.targetLesionsStatus}>
                        <p slot="header">Hi</p>
                    </app-lesions>
                    <!-- <kor-card flex-direction="row" flat>
                        <kor-icon icon="chevron_left"></kor-icon>
                    </kor-card> -->
                </kor-card>
                <kor-button slot="footer" color="secondary" label="Delete" @click=${() => this.deleteData()}></kor-button>
                <kor-button slot="footer" label="Create" @click=${() => this.createPatient()}></kor-button>
                <kor-button slot="footer" label="< Back" @click=${() => this.dispatchBack()}></kor-button>
            </kor-card>
            ${!this._showAlert ? html `` : html `
                <app-alert-modal message="${"If you go back, you will lose your data for this register. Do you want to continue?"}" @alert-cancelled=${() => this.dispatchCancelAlert()} @alert-continued=${() => this.dispatchContinueAlert()} ></app-alert-modal>
            `}
        `;
    };
}

customElements.define('app-patient-create', PatientCreate);