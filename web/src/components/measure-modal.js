import '@kor-ui/kor';
import {html, LitElement} from 'lit';

class MeasureModal extends LitElement {
    static properties = {
        patient: {},
        newMeasure: {},
        _targetLesionsDisabled: {},
        _targetLesionsBackup: {},
        _dateStatus: {state: true},
        _targetLesionsStatus: {state: true},
        _nonTargetLesionsStatus: {state: true},
        _newLesionsStatus: {state: true},
        //openCloseVariable: {type: Boolean, reflect: true}
    };
    
    constructor() {
        super();
        this._targetLesionsDisabled = {};
        this._targetLesionsBackup = {};
        this._targetLesionsStatus = {};
        this._nonTargetLesionsStatus = {};
        //this.openCloseVariable = false;
    };

    // attributeChangedCallback(name, oldval, newval) {
    //     super.attributeChangedCallback(name, oldval, newval);
    //     console.log("attributeChangedCallback");
    //     if(name == "patient" && newval != null) {
    //         this.initPatientVariables();
    //     }
    //     if(name == "openclosevariable" && newval != null) {
    //         this.initVariables();
    //     }
    // }

    // initPatientVariables() {
    //     console.log("init variables");
    //     if (this.patient) {
    //         Object.keys(this.patient.targetLesions).map((lesion) => {
    //             this._targetLesionsDisabled[this.patient.targetLesions[lesion].id] = false
    //         });
    //     }
    // }

    // initVariables() {
    //     this._targetLesionsDisabled = {};
    //     this._targetLesionsBackup = {};
    //     this._targetLesionsStatus = {};
    //     this._nonTargetLesionsStatus = {};
    //     this._dateStatus = null;
    //     this._newLesionsStatus = null;
    // }

    // update(changedProperties) {
    //     super.update(changedProperties);
    //     //console.log(changedProperties);
    //     if(changedProperties.has("openCloseVariable") && !changedProperties.get("openCloseVariable")) {
    //         this.initVariables();
    //     }
    // }

    disconnectedCallback(){
        super.disconnectedCallback();
        this._targetLesionsDisabled = {};
        this._targetLesionsBackup = {};
        this._targetLesionsStatus = {};
        this._nonTargetLesionsStatus = {};
        this._dateStatus = null;
        this._newLesionsStatus = null;
    }

    changeValue(type, lesion){
        return ({target}) => {
            if (type) {
                if (!this.newMeasure[type]) this.newMeasure[type] = {};
                this.newMeasure[type][lesion] = target.value;
            } else {
                this.newMeasure[lesion] = target.value;
            }
       
        }
    }

    setValue(value, lesion){
        return () => {
                this.newMeasure.data[lesion] = value;
        }
    }

    setLesionsValue(value){
        return () => {
                this.newMeasure.data.newLesions = value;
        }
    }

    toggleNE(lesion) {
        this._targetLesionsDisabled = this.modifyObject(this._targetLesionsDisabled, lesion, !this._targetLesionsDisabled[lesion]);
        if (this._targetLesionsDisabled[lesion]) {
            this._targetLesionsBackup[lesion] = this.newMeasure.data[lesion] ? this.newMeasure.data[lesion] : 0;
            this.newMeasure.data[lesion] = "NE";
        } else {
            this.newMeasure.data[lesion] = this._targetLesionsBackup[lesion]
        }
    }

    modifyObject2(sourceObject, key, value){
        var target = {};
        target[key] = value;
        delete sourceObject[key];
        return Object.assign(target, sourceObject);
    }

    modifyObject(sourceObject, key, value){
        var target = Object.assign({}, sourceObject);
        target[key] = value;
        return target
    }

    validateForm() {
        let output = this.validateDate();
        output = this.validateTargetLesions() && output;
        output = this.validateNonTargetLesions() && output;
        return this.validateNewLesions() && output;
    };

    validateDate() {
        console.log("validateDate");
        if (!this.newMeasure.date) { 
            this._dateStatus =  "error";
            return false;
        } else {
            this._dateStatus = "success";
            return true;
        }
    }

    validateTargetLesions() {
        console.log("validateTargetLesions");
        return Object.keys(this.patient.targetLesions).map((lesion) => {
            if (!this.newMeasure.data[this.patient.targetLesions[lesion].id]) { 
                this._targetLesionsStatus = this.modifyObject(this._targetLesionsStatus, this.patient.targetLesions[lesion].id, "error");
                console.log(this._targetLesionsStatus)
                return false;
            } else {
                this._targetLesionsStatus = this.modifyObject(this._targetLesionsStatus, this.patient.targetLesions[lesion].id, "success");
                return true;
            }
        });
    }

    validateNonTargetLesions() {
        console.log("validateNonTargetLesions");
        return Object.keys(this.patient.nonTargetLesions).map((lesion) => {
            if (!this.newMeasure.data[this.patient.nonTargetLesions[lesion].id]) { 
                this._nonTargetLesionsStatus = this.modifyObject(this._nonTargetLesionsStatus, this.patient.nonTargetLesions[lesion].id, "error");
                return false;
            } else {
                this._nonTargetLesionsStatus = this.modifyObject(this._nonTargetLesionsStatus, this.patient.nonTargetLesions[lesion].id, "success");
                return true;
            }
        });
    }

    validateNewLesions() {
        console.log("validateNewLesions");
        if (!this.newMeasure.data.newLesions) { 
            this._newLesionsStatus =  "error";
            return false;
        } else {
            this._newLesionsStatus = "success";
            return true;
        }
    }

    dispatchSaveMeasure () {
        if(this.validateForm()){
            this.dispatchEvent(new CustomEvent('measureModified', {
                detail: this.newMeasure,
                bubbles: true,
                composed: true,
            }));
            this.openCloseVariable = false;
        }
    }

    dispatchCloseMeasure () {
        console.log("dispatchCloseMeasure");
        this.dispatchEvent(new CustomEvent('measureClosed', {
            detail: '',
            bubbles: true,
            composed: true,
        }));
        this.openCloseVariable = false;
    }

    render() {
        //this.initVariables()
        return html`
            <kor-modal id="addMeasure" visible sticky label="Add Measure" height="1000">
                <kor-input tabindex="1" @value-changed=${this.changeValue(null,  "date")} label="Date" autofocus="true" type="date" .status=${this._dateStatus}></kor-input>
                <kor-card style="flex-wrap;" flat label="Target Lesions" flat flex-direction="column">
                    ${this.renderTargetLocalizations()}
                </kor-card>
                <kor-card style="flex-wrap;" flat label="Non Target Lesions" flat flex-direction="column">
                    ${this.renderNonTargetLocalizations()}
                </kor-card>
                <kor-card style="flex-wrap;" flat flex-direction="row">
                    <kor-text style="flex: 4 1;">New Lesions</kor-text>
                    <kor-switch style="flex: 1 1;">
                        <kor-switch-item @active-changed=${this.setLesionsValue("NO")} label="NO"></kor-switch-item>
                        <kor-switch-item @active-changed=${this.setLesionsValue("YES")} label="YES"></kor-switch-item>
                    </kor-switch>
                    ${this._newLesionsStatus ? html`
                        <kor-badge .status=${this._newLesionsStatus}></kor-badge>` 
                    : ''}
                </kor-card>
                <kor-button slot="footer" color="secondary" label="Close" @click=${() => this.dispatchCloseMeasure()}></kor-button>
                <kor-button slot="footer" color="primary" label="Add" @click=${() => this.dispatchSaveMeasure()}></kor-button>
            </kor-modal>
        `;
    }

    renderTargetLocalizations(){
        return !this.patient.targetLesions  ? html``: Object.keys(this.patient.targetLesions).map((lesion, index) => html`
            <kor-card style="flex-wrap;" flat flex-direction="row">
                <kor-input min=0 .disabled=${this._targetLesionsDisabled[this.patient.targetLesions[lesion].id]} style="flex: 2 1;" tabindex="${1+index}" id=${this.patient.targetLesions[lesion].id} @value-changed=${this.changeValue("data", this.patient.targetLesions[lesion].id)} label="${this.patient.targetLesions[lesion].localization}" type="number"></kor-input>
                <kor-tool toggle @active-changed=${() => this.toggleNE(this.patient.targetLesions[lesion].id)} label="NE"></kor-tool>
                ${this._targetLesionsStatus[this.patient.targetLesions[lesion].id] ? html`
                    <kor-badge .status=${this._targetLesionsStatus[this.patient.targetLesions[lesion].id]}></kor-badge>` 
                : ''}
            </kor-card>
        `);
    };

    renderNonTargetLocalizations(){
        return !this.patient.nonTargetLesions ? html``:  Object.keys(this.patient.nonTargetLesions).map((lesion, index) => html`
            <kor-card style="flex-wrap;" flat flex-direction="row">
                <kor-text style="flex: 1 1;">${this.patient.nonTargetLesions[lesion].localization}</kor-text>
                <kor-switch style="flex: 1 1;"> 
                    <kor-switch-item @active-changed=${this.setValue("UI", this.patient.nonTargetLesions[lesion].id)} label="UI"></kor-switch-item>
                    <kor-switch-item @active-changed=${this.setValue("UC", this.patient.nonTargetLesions[lesion].id)} label="UC"></kor-switch-item>
                    <kor-switch-item @active-changed=${this.setValue("ABS", this.patient.nonTargetLesions[lesion].id)} label="ABS"></kor-switch-item>
                    <kor-switch-item @active-changed=${this.setValue("NE", this.patient.nonTargetLesions[lesion].id)} label="NE"></kor-switch-item>
                </kor-switch>
                ${this._nonTargetLesionsStatus[this.patient.nonTargetLesions[lesion].id] ? html`
                    <kor-badge .status=${this._nonTargetLesionsStatus[this.patient.nonTargetLesions[lesion].id]}></kor-badge>` 
                : ''}
            </kor-card>
        `);
    };
}

customElements.define('app-measure-modal', MeasureModal);