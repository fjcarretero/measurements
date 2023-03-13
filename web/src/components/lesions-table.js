import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';
import './lesion-modal.js';

class LesionsTable extends LitElement {

    static properties = {
        status: {},
        label: {},
        rows: {},
        prefix: {},
        lesionLocations: {type: Array},
        addLesionModal: {type: Boolean},
        create: {type: Boolean},
        date: {},
        userRole: {},
        _lesionId: {},
        _lesion: {},
        _showAlert: {state: true}
    };

    static styles = css`
        ::slotted (*) {
            grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
        }
    `;
    
    constructor() {
        super();
        this.addLesionModal = false;
    };

    lesionsModalClosedListener() {
        this.addLesionModal = false;
    }

    deleteLesion(lesionId) {
        this._lesionId = lesionId;
        this._showAlert = true;
    }

    addLesion() {
        this._label = "Add Lesion";
        this._buttonLabel = "Add";
        this._lesion = {}
        this.addLesionModal = true;
    }

    modifyLesion(lesion) {
        console.log(lesion);
        this._label = "Modify Lesion";
        this._buttonLabel = "Modify";
        this._lesion = lesion;
        this.addLesionModal = true;
    }

    dispatchContinueAlert() {
        this.dispatchEvent(new CustomEvent(this.prefix + '-lesion-deleted', {
            detail: this._lesionId,
            bubbles: true,
            composed: true,
        }));
        this._showAlert = false;
    }

    dispatchCancelAlert() {
        this._showAlert = false;
    }

    render(){
        //console.log("tableSize=" + this.tableSize)
        return !this.rows ? html``: html`
            <kor-card label=${this.label} flex-direction="row" flat>
                ${!this.status ? html`` : html`
                    <kor-badge slot="functions" status=${this.status}></kor-badge>
                `}
                ${!this.create ? html`
                    <kor-table condensed flex-direction="row" columns="35px 45px 120px 150px 70px 90px">
                        <kor-table-row slot="header">
                            <kor-table-cell head grid-cols="1"></kor-table-cell>
                            <kor-table-cell head grid-cols="1">ID</kor-table-cell>
                            <kor-table-cell head grid-cols="1">Location</kor-table-cell>
                            <kor-table-cell head grid-cols="1">Verbatim</kor-table-cell>
                            <kor-table-cell head grid-cols="1">Lymph</br>Node</kor-table-cell>
                            <kor-table-cell head grid-cols="1" alignment="right">Basal</br>${this.date}</kor-table-cell>
                        </kor-table-row>
                        ${this.renderRows(this.rows)}
                        <slot></slot>
                    </kor-table>`
                : html`
                    <kor-table condensed flex-direction="row" columns="35px 45px 120px 150px 70px 90px">
                        <kor-table-row slot="header">
                            <kor-table-cell head grid-cols="1"></kor-table-cell>
                            <kor-table-cell head grid-cols="1">ID</kor-table-cell>
                            <kor-table-cell head grid-cols="1">Localization</kor-table-cell>
                            <kor-table-cell head grid-cols="1">Verbatim</kor-table-cell>
                            <kor-table-cell head grid-cols="1">Lymph</br>Node</kor-table-cell>
                            <kor-table-cell head grid-cols="1" alignment="right">Basal</br>${this.date}</kor-table-cell>
                        </kor-table-row>
                        ${this.renderRows(this.rows)}
                        <slot></slot>
                    </kor-table>
                    <kor-button slot="header" label="Add Lesion" @click=${()=> this.addLesion()}></kor-button>
                `}
            </kor-card>
            ${!this.addLesionModal ? html`` : html`
                <app-lesion-modal .lesionLocations=${this.lesionLocations} .prefix=${this.prefix} @lesion-closed=${this.lesionsModalClosedListener} .newLesion=${this._lesion} .label=${this._label} .buttonLabel=${this._buttonLabel}></app-lesion-modal>
            `}
            ${!this._showAlert ? html `` : html `
                <app-alert-modal message="Do you want to delete this lesion?" @alert-cancelled=${() => this.dispatchCancelAlert()} @alert-continued=${() => this.dispatchContinueAlert()} ></app-alert-modal>
            `}
        `;
    };

    renderRows(rows){
        return !rows ? html``: Object.keys(rows).sort().map(key => html`
            <kor-table-row>
                ${!this.create ? 
                    (this.userRole != "admin" ?
                        html`<kor-table-cell grid-cols="1"></kor-table-cell>` 
                        : html `<kor-table-cell grid-cols="1"><kor-icon @click=${()=> this.modifyLesion(rows[key])} button icon="edit" size="s"></kor-icon></kor-table-cell>`)
                    : html `
                    <kor-table-cell grid-cols="1"><kor-icon @click=${()=> this.deleteLesion(rows[key].id)} button icon="delete"></kor-icon></kor-table-cell>
                `}
                <kor-table-cell grid-cols="1">${rows[key].id}</kor-table-cell>
                <kor-table-cell grid-cols="1">${rows[key].localization}</kor-table-cell>
                <kor-table-cell grid-cols="1">${rows[key].verbatim}</kor-table-cell>
                <kor-table-cell grid-cols="1">${rows[key].lymphNode}</kor-table-cell>
                <kor-table-cell grid-cols="1" alignment="right">${rows[key].basal}</kor-table-cell>
            </kor-table-row>
        `);
    };
}

customElements.define('app-lesions-table', LesionsTable);