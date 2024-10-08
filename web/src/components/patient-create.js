import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import {PatientsDataProvider} from '../patients-data-provider.js';
import './notifications.js';

class PatientCreate extends LitElement {

    static properties = {
        patient: {},
        _patient: {state: true},
        // targetLesionIndex: {state: true},
        // nonTargetLesionIndex:{state: true},
        targetLesionsStatus: {state: true},
        _showAlert: {type: Boolean, state: true}
    };
    
    constructor() {
        super();
        console.log("constructor")
        // this.nonTargetLesionIndex = 1;
        // this.targetLesionIndex = 1;
        this.patientsDataProvider = new PatientsDataProvider();
        this.patient = {
            targetLesions: [],
            nonTargetLesions: []
        };
        this._showAlert = false;
        // this.addEventListener('target-lesion-added', this.addTargetLesion);
        // this.addEventListener('non-target-lesion-added', this.addNonTargetLesion);
        // this.addEventListener('target-lesion-deleted', this.deleteTargetLesion);
        // this.addEventListener('non-target-lesion-deleted', this.deleteNonTargetLesion);
    };

    update(changed) {
        super.update(changed);
        console.log("changed");
        console.log(changed);
        if (changed.has('patient')) {
            console.log(changed.get('patient'))
            //this.patient.targetLesions = [...changed.get('patient')['targetLesions']];
        }
    }

    disconnectedCallback(){
        super.disconnectedCallback()
        console.log("disconnectedCallback");
        this.patient = {};
        // this.targetLesionIndex = 1
        // this.nonTargetLesionIndex = 1
        this.targetLesionsStatus = null;
        this._showAlert = false;
    }

    changeResearchIdValue({detail}) {
        this.patient.studyId = detail;
    }

    changePatientIdValue({detail}){
        this.patient.patientId = detail;
    }

    // addTargetLesion({detail}) {
    //     console.log("addTargetLesion");
    //     console.log(detail);
    //     console.log(this.targetLesionIndex);
    //     detail.id = 'tl' + this.targetLesionIndex++;
    //     console.log(detail);
    //     this.patient = {
    //         ...this.patient, 
    //         targetLesions: [...this.patient.targetLesions, detail]
    //     }
    //     console.log(this.patient);
    // }

    // addNonTargetLesion({detail}) {
    //     console.log("addNonTargetLesion");
    //     console.log(detail);
    //     detail.id = 'ntl' + this.nonTargetLesionIndex++;
    //     this.patient = {
    //         ...this.patient, 
    //         nonTargetLesions: [...this.patient.nonTargetLesions, detail]
    //     }
    // }

    // deleteTargetLesion({detail}) {
    //     console.log("deleteTargetLesion");
    //     console.log(detail);
    //     this.targetLesionIndex--;
    //     this.patient = {
    //         ...this.patient, 
    //         targetLesions: this.patient.targetLesions.filter(lesion => lesion.id != detail)
    //     }
    // }

    // deleteNonTargetLesion({detail}) {
    //     console.log("deleteNonTargetLesion");
    //     console.log(detail);
    //     this.nonTargetLesionIndex--;
    //     this.patient = {
    //         ...this.patient, 
    //         nonTargetLesions: this.patient.nonTargetLesions.filter(lesion => lesion.id != detail)
    //     }
    // }

    deleteData() {
        console.log("deleteData")
        this.dispatchEvent(new CustomEvent('patient-lesions-deleted', {
            detail: '',
            bubbles: true,
            composed: true,
        }))
        // this.patient = {
        //     ...this.patient,
        //     targetLesions: [],
        //     nonTargetLesions: []
        // };
        // this.targetLesionIndex = 1
        // this.nonTargetLesionIndex = 1
        this.targetLesionsStatus = null
        this._showAlert = false;
    }

    async createPatient() {
        if(this.validateForm()){
            this.patient.id = this.patient.studyId + "-" + this.patient.patientId
            let result = await this.patientsDataProvider.postPatients(this.patient);
            if (result.status == 201) {
                this.dispatchEvent(new CustomEvent('patient-created', {
                    detail: this.patient,
                    bubbles: true,
                    composed: true,
                }))
            } else {
                let json = await result.json();
                console.log(json);
                this.dispatchEvent(new CustomEvent('notification', {
                    detail: {status: 'error', message: json.error.message},
                    bubbles: true,
                    composed: true,
                })) 
            }
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
                <app-notification></app-notification>
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