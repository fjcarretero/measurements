import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import './alert-modal.js'

class PatientModal extends LitElement {
    static properties = {
        researchs: {type: Array},
        newPatient: {type: Object},
        _recist: {state: true},
        _iRecist: {state: true},
        _patientIdStatus: {state: true},
        _researchStatus: {state: true},
        _studyStatus: {state: true},
        _dateStatus: {state: true},
        _showAlert: {type: Boolean, state: true}
        //openCloseVariable: {type: Boolean, reflect: true}
    };
    
    constructor() {
        super();
        this.newPatient = {};
        this._patientIdStatus = null;
        this._researchStatus = null;
        this._studyStatus = null;
        this._dateStatus = null;
        this._recist = true;
        this._iRecist = false;
        this._showAlert = false;
        //this.openCloseVariable = false;
    };

    disconnectedCallback() {
        super.disconnectedCallback();
        console.log("disc");
        this.newPatient = {};
        this._patientIdStatus = null;
        this._researchStatus = null;
        this._studyStatus = null;
        this._dateStatus = null;
        this._recist = true;
        this._iRecist = false;     
        this._showAlert = false;   
    }

    // update(changedProperties) {
    //     super.update(changedProperties);
    //     //console.log(changedProperties);
    //     if(changedProperties.has("openCloseVariable") && !changedProperties.get("openCloseVariable")) {
    //         this.initVariables();
    //     }
    // }

    // attributeChangedCallback(name, oldval, newval) {
    //     super.attributeChangedCallback(name, oldval, newval);
    //     console.log("attributeChangedCallback");
    //     console.log(name);
    //     console.log(newval);
    //     console.log(oldval);

    //     if(name == "openclosevariable" && newval != null) {
    //         //this.initVariables();
    //     }
    // }

    // initVariables() {
    //     console.log("init variables patient");
    //     this.newPatient = {}
    //     this._patientIdStatus = null;
    //     this._researchStatus = null;
    //     this._studyStatus = null;
    //     this._recist = true;
    //     this._iRecist = false;
    // }

    changeValueId(){
        return ({target}) => {
            //console.log(target);
            this.newPatient.patientId = target.value.length > 20 ? target.value.substring(0,20) : target.value;
            //console.log(this.newPatient.id);
            return target;
        }
    }

    changeValueResearch(){
        return ({target}) => {   
            this.newPatient.study = target.value;
            this.newPatient.studyId = this.researchs.filter(research => research.name==target.value)[0].id;
            return target
        }
    }

    changeValueDate(){
        return ({target}) => {
            this.newPatient.date = target.value;
            return target;
        }
    }

    toggleRecist() {
        this._recist = this._recist;
    }

    toggleIRecist() {
        this._iRecist = this._iRecist;
    }

    validateForm() {
        let output = this.validatePatientId();
        output = this.validateResearch() && output;
        output = this.validateDate() && output;
        //return this.validateStudy() && output;
        return output;
    };

    validatePatientId() {
        if (!this.newPatient.patientId) { 
            this._patientIdStatus =  "error";
            return false;
        } else {
            this._patientIdStatus = "success";
            return true;
        }
    }

    validateResearch() {
        if (!this.newPatient.study) { 
            this._researchStatus =  "error";
            return false;
        } else {
            this._researchStatus = "success";
            return true;
        }
    }

    validateDate() {
        if (!this.newPatient.date) { 
            this._dateStatus =  "error";
            return false;
        } else {
            this._dateStatus = "success";
            return true;
        }
    }

    validateStudy() {
        if (!this.newPatient.study) { 
            this._studyStatus =  "error";
            return false;
        } else {
            this._studyStatus = "success";
            return true;
        }
    }

    dispatchSavePatient () {
        if(this.validateForm()){
            this.dispatchEvent(new CustomEvent('patient-added', {
                detail: this.newPatient,
                bubbles: true,
                composed: true,
            }));
            //this.dispatchClosePatient();
        }
    }

    dispatchClosePatient () {
        this._showAlert = true;
    }

    dispatchCancelAlert () {
        this._showAlert = false;
    }

    dispatchContinueAlert () {
        this.dispatchEvent(new CustomEvent('patient-closed', {
            detail: '',
            bubbles: true,
            composed: true,
        }));
        this._showAlert = false;
    }

    render() {
        //console.log("render patient");
        //console.log(this._patientIdStatus);
        return html`
            <kor-modal id="addLesion" visible sticky label="Add Patient" height="1000">
                <kor-input tabindex="1" @value-changed=${this.changeValueId()} label="PatientId" autofocus="true" type="text" .status=${this._patientIdStatus}></kor-input>
                <kor-input tabindex="2" @value-changed=${this.changeValueResearch()} label="Study" autofocus="true" type="select" .status=${this._researchStatus}>
                    ${!this.researchs ? html`` : this.researchs.map(research => html`
                        <kor-menu-item label=${research.name}></kor-menu-item>`
                    )}
                </kor-input>
                <kor-input tabindex="3" @value-changed=${this.changeValueDate()} label="date" autofocus="true" type="date" .status=${this._dateStatus}></kor-input>
                <kor-card style="flex-wrap;" flat flex-direction="row">
                <kor-tool toggle active @active-changed=${() => this.toggleRecist()} label="Recist"></kor-tool>
                <kor-tool toggle @active-changed=${() => this.toggleIRecist()} label="iRecist"></kor-tool>
                ${this._studyStatus ? html`
                    <kor-badge .status=${this._studyStatus}></kor-badge>` 
                : ''}
                </kor-card>
                <kor-button slot="footer" color="secondary" label="Close" @click=${() => this.dispatchClosePatient()}></kor-button>
                <kor-button slot="footer" color="primary" label="Create" @click=${() => this.dispatchSavePatient()}></kor-button>
            </kor-modal>
            ${!this._showAlert ? html `` : html `
                <app-alert-modal message="${"If you go back, you will lose your data for this register. Do you want to continue?"}" @alert-cancelled="${() => this.dispatchCancelAlert()}" @alert-continued="${() => this.dispatchContinueAlert()}" ></app-alert-modal>
            `}
        `;
    }
}

customElements.define('app-patient-modal', PatientModal);