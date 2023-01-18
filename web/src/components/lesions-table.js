import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';
import './lesion-modal.js';

class LesionsTable extends LitElement {

    static properties = {
        status: {},
        label: {},
        rows: {},
        prefix: {},
        addLesionModal: {type: Boolean},
        create: {type: Boolean},
        date: {}
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

    render(){
        //console.log("tableSize=" + this.tableSize)
        return !this.rows ? html``: html`
            <kor-card label=${this.label} flex-direction="row" flat>
                ${!this.status ? html`` : html`
                    <kor-badge slot="functions" status=${this.status}></kor-badge>
                `}
                <kor-table condensed flex-direction="row" columns="45px 120px 150px 70px 90px">
                    <kor-table-row slot="header">
                        <kor-table-cell head grid-cols="1">ID</kor-table-cell>
                        <kor-table-cell head grid-cols="1">Localization</kor-table-cell>
                        <kor-table-cell head grid-cols="1">Verbatim</kor-table-cell>
                        <kor-table-cell head grid-cols="1">Lymph</br>Node</kor-table-cell>
                        <kor-table-cell head grid-cols="1" alignment="right">Basal</br>${this.date}</kor-table-cell>
                    </kor-table-row>
                    ${this.renderRows(this.rows)}
                    <slot></slot>
                </kor-table>
                ${!this.create ? html`` : html`
                    <kor-button slot="header" label="Add Lesion" @click=${()=> this.addLesionModal = true}></kor-button>
                `}
            </kor-card>
            ${!this.addLesionModal ? html`` : html`
                <app-lesion-modal .prefix=${this.prefix} @lesion-closed=${this.lesionsModalClosedListener}></app-lesion-modal>
            `}
        `;
    };

    renderRows(rows){
        console.log("rows");
        console.log(rows);
        return !rows ? html``: Object.keys(rows).sort().map(key => html`
            <kor-table-row>
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