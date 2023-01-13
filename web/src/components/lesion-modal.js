import '@kor-ui/kor';
import {html, LitElement} from 'lit';

class LesionModal extends LitElement {
    static properties = {
        newLesion: {},
        prefix: {},
        _localizationStatus: {state: true},
        _verbatimStatus: {state: true},
        _lymphNodeStatus: {state: true},
        _basalStatus: {state: true},
        //openCloseVariable: {type: Boolean, reflect: true}
    };
    
    constructor() {
        super();
        this.newLesion= {};
        this._localizationStatus = null;
        this._verbatimStatus = null;
        this._lymphNodeStatus = null;
        this._basalStatus = null;
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
            return target
        }
    }

    changeValue(type){
        return ({target}) => {
            this.newLesion[type] = target.value;
        }
    }

    setValue(type, value){
        return () => {
            this.newLesion[type] = value;
        }
    }

    toggleBasal(){
        if(!this.newLesion.basal || this.newLesion.basal=="") {
            this.newLesion.basal = "PRE"
        } else {
            this.newLesion.basal = ""
        }
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
            this.prefix == "target" ? this.newLesion.id = "tl" : this.newLesion.id = "ntl"
            this.dispatchEvent(new CustomEvent(this.prefix + '-lesion-added', {
                detail: this.newLesion,
                bubbles: true,
                composed: true,
            }));
            this.dispatchCloseLesion();
        }
    }

    dispatchCloseLesion () {
        this.dispatchEvent(new CustomEvent('lesion-closed', {
            detail: '',
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        //this.initVariables()
        return html`
            <kor-modal id="addLesion" visible sticky label="Add Lesion" height="1000">
                <kor-input tabindex="1" @value-changed=${this.changeValue("localization")} label="Localization" autofocus="true" type="select" .status=${this._localizationStatus}>
                    <kor-menu-item label="NA"></kor-menu-item>
                    <kor-menu-item label="BRAIN"></kor-menu-item>
                    <kor-menu-item label="BREAST"></kor-menu-item>
                    <kor-menu-item label="LIVER"></kor-menu-item>
                    <kor-menu-item label="LUNG"></kor-menu-item>
                    <kor-menu-item label="LYMPH NODES"></kor-menu-item>
                    <kor-menu-item label="PANCREAS"></kor-menu-item>
                    <kor-menu-item label="SPLEEN"></kor-menu-item>
                    <kor-menu-item label="STOMACH"></kor-menu-item>
                </kor-input>
                <kor-input tabindex="2" @value-changed=${this.changeValueVerbatim()} label="Verbatim" autofocus="true" .status=${this._verbatimStatus}></kor-input>
                <kor-card style="flex-wrap;" flat flex-direction="row">
                    <kor-text style="flex: 4 1;">Lymph Node</kor-text>
                    <kor-switch style="flex: 1 1;">
                        <kor-switch-item @active-changed=${this.setValue("lymphNode", "NO")} label="NO"></kor-switch-item>
                        <kor-switch-item @active-changed=${this.setValue("lymphNode", "YES")} label="YES"></kor-switch-item>
                    </kor-switch>
                    ${this._lymphNodeStatus ? html`
                        <kor-badge .status=${this._lymphNodeStatus}></kor-badge>` 
                    : ''}
                </kor-card>
                ${this.prefix == "target" ? html`
                    <kor-input tabindex="4" @value-changed=${this.changeValue("basal")} label="Basal" autofocus="true" type="Number" .status=${this._basalStatus}></kor-input>` :
                html`
                    <kor-card style="flex-wrap;" flat flex-direction="row">
                        <kor-text style="flex: 4 1;">Basal</kor-text>
                        <kor-tool @active-changed=${() => this.toggleBasal()} label="PRESENT" toggle></kor-tool>
                        ${this._basalStatus ? html`
                            <kor-badge .status=${this._basalStatus}></kor-badge>` 
                        : ''}
                    </kor-card>
                `}
                <kor-button slot="footer" color="secondary" label="Close" @click=${() => this.dispatchCloseLesion()}></kor-button>
                <kor-button slot="footer" color="primary" label="Add" @click=${() => this.dispatchSaveLesion()}></kor-button>
            </kor-modal>
        `;
    }
}

customElements.define('app-lesion-modal', LesionModal);