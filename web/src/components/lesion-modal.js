import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import './alert-modal.js';

class LesionModal extends LitElement {
    static properties = {
        newLesion: {},
        prefix: {},
        lesionLocations: {type: Array},
        label: {},
        buttonLabel: {},
        _localizationStatus: {state: true},
        _verbatimStatus: {state: true},
        _lymphNodeStatus: {state: true},
        _basalStatus: {state: true},
        _showAlert: {type: Boolean, state: true}
        //openCloseVariable: {type: Boolean, reflect: true}
    };
    
    constructor() {
        super();
        this.newLesion= {};
        this._localizationStatus = null;
        this._verbatimStatus = null;
        this._lymphNodeStatus = null;
        this._basalStatus = null;
        this._showAlert = false;
        //this.openCloseVariable = false;
    };

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
    //     console.log("init variables");
    //     this.newLesion = {};
    //     this._localizationStatus = null;
    //     this._verbatimStatus = null;
    //     this._lymphNodeStatus = null;
    //     this._basalStatus = null;
    // }

    disconnectedCallback(){
        super.disconnectedCallback()
        console.log("disconnectedCallback");
        this.newLesion = {};
        this._localizationStatus = null;
        this._verbatimStatus = null;
        this._lymphNodeStatus = null;
        this._basalStatus = null;
        this._showAlert = false;
    }

    // update(changedProperties) {
    //     super.update(changedProperties);
    //     //console.log(changedProperties);
    //     if(changedProperties.has("openCloseVariable") && !changedProperties.get("openCloseVariable")) {
    //         this.initVariables();
    //     }
    // }

    changeValueVerbatim(){
        return ({target}) => {
            if (target.value.length > 20) {
                target.value = target.value.substring(0,20);
            }    
            this.newLesion.verbatim = target.value;
            return target;
        }
    }

    changeValueLocation(){
        return ({target}) => {
            this.newLesion.localization = target.value;
            if (this.newLesion.localization == "LYMPH NODES") {
                this.newLesion.lymphNode = "YES";
            } else {
                this.newLesion.lymphNode = "NO";
            }
            return target;
        }
    }

    changeValue(type){
        return ({target}) => {
            this.newLesion[type] = target.value;
            return target;
        }
    }

    setValue(type, value){
        return () => {
            this.newLesion[type] = value;
        }
    }

    toggleBasal(){
        console.log("toggle");
        if(!this.newLesion.basal || this.newLesion.basal=="") {
                this.newLesion.basal = "PRE"
            } else {
                this.newLesion.basal = ""
            }

    }

    click(){
        console.log("click")
    }

    modifyObject(sourceObject, key, value){
        var target = Object.assign({}, sourceObject);
        target[key] = value;
        return target
    }

    validateForm() {
        let output = this.validateLocalization();
        output = this.validateLymphNode() && output;
        output = this.validateVerbatim() && output;
        return this.validateBasal() && output;
    };

    validateLocalization() {
        if (!this.newLesion.localization) { 
            this._localizationStatus =  "error";
            return false;
        } else {
            this._localizationStatus = "success";
            return true;
        }
    }

    validateVerbatim() {
        if (!this.newLesion.verbatim) { 
            this.newLesion.verbatim =  "";
            return true;
        } 
        return true
    }

    validateLymphNode() {
        if (!this.newLesion.lymphNode) { 
            this._lymphNodeStatus =  "error";
            return false;
        } else {
            this._lymphNodeStatus = "success";
            return true;
        }
    }

    validateBasal() {
        if (!this.newLesion.basal && this.prefix == "non-target") {
            this.newLesion.basal = "";
            return true;
        }
        if (!this.newLesion.basal && this.prefix == "target") { 
            this._basalStatus =  "error";
            return false;
        } else {
            this._basalStatus = "success";
            return true;
        }
    }

    dispatchSaveLesion () {
        if(this.validateForm()){
            if (this.buttonLabel == 'Add') {
                this.prefix == "target" ? this.newLesion.id = "tl" : this.newLesion.id = "ntl"
                this.dispatchEvent(new CustomEvent(this.prefix + '-lesion-added', {
                    detail: {...this.newLesion},
                    bubbles: true,
                    composed: true,
                }));
            } else {
                console.log("colorin colorado")
                this.dispatchEvent(new CustomEvent(this.prefix + '-lesion-modified', {
                    detail: this.newLesion,
                    bubbles: true,
                    composed: true,
                }));
            }
            this.dispatchContinueAlert();
        }
    }

    dispatchCloseLesion () {
        this._showAlert = true;
    }

    dispatchCancelAlert () {
        this._showAlert = false;
    }

    dispatchContinueAlert () {
        this.dispatchEvent(new CustomEvent('lesion-closed', {
            detail: '',
            bubbles: true,
            composed: true,
        }));
        this._showAlert = false;
    }

    render() {
        //this.initVariables()
        return html`
            <kor-modal id="addLesion" visible sticky label=${this.label} height="1000">
                <kor-input tabindex="1" @value-changed=${this.changeValueLocation()} label="Location" autofocus="true" type="select" .status=${this._localizationStatus} .value=${this.newLesion?.localization}>
                    ${!this.lesionLocations ? html ``: this.lesionLocations.map(lesionLocation => html `
                        <kor-menu-item label="${lesionLocation}"></kor-menu-item>
                    `)}
                </kor-input>
                <kor-input tabindex="2" @value-changed=${this.changeValueVerbatim()} label="Verbatim" autofocus="true" .status=${this._verbatimStatus} .value=${this.newLesion?.verbatim}></kor-input>
                ${this.prefix == "target" ? html`
                    <kor-input tabindex="4" @value-changed=${this.changeValue("basal")} label="Basal" autofocus="true" type="Number" .status=${this._basalStatus} .value=${this.newLesion?.basal}></kor-input>` :
                html`
                    <kor-card style="flex-wrap;" flat flex-direction="row">
                        <kor-text style="flex: 3 1; padding: var(--spacing-s);">Basal</kor-text>
                        <kor-tool style="flex: 1 1;" @click=${() => this.toggleBasal()} label="PRESENT" toggle ?active=${this.newLesion.basal == "PRE"}></kor-tool>
                        ${this._basalStatus ? html`
                            <kor-badge .status=${this._basalStatus}></kor-badge>` 
                        : ''}

                    </kor-card>
                `}
                <kor-button slot="footer" color="secondary" label="Close" @click=${() => this.dispatchCloseLesion()}></kor-button>
                <kor-button slot="footer" color="primary" label=${this.buttonLabel} @click=${() => this.dispatchSaveLesion()}></kor-button>
            </kor-modal>
            ${!this._showAlert ? html `` : html `
                <app-alert-modal message="If you go back, you will lose your data for this register. Do you want to continue?" @alert-cancelled=${() => this.dispatchCancelAlert()} @alert-continued=${() => this.dispatchContinueAlert()} ></app-alert-modal>
            `}
        `;
    }
}

customElements.define('app-lesion-modal', LesionModal);