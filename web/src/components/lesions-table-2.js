import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';
import './measurement-target.js';

class LesionsTable extends LitElement {

    static properties = {
        label: {},
        rows: {},
        measurements: {},
        suffix: {},
        layout: {},
        tableSize: {},
        expanded: {}
    };

    static get styles() {
        return css`
            .perico {
                border-bottom: 1px solid rgba(var(--neutral-1), 0.15); 
                display: flex; 
                align-items: center; 
                padding: var(--spacing-s); 
                font: var(--body-1); 
                overflow: hidden; 
                cursor: default; 
                border-color: rgba(var(--neutral-1), 0.4); 
                width: 100%; 
                justify-content: center;
            }
        `
    };
    
    constructor() {
        super();
        this.expanded = false;
    };

    getTableSize() {
        return !this.measurements ? 0 : this.measurements.length;
    }

    update(changed) {
        super.update(changed);
        console.log("changed");
        console.log(changed);
        if (changed.has('rows') || changed.has('measurements')) {
            this.updateVariables()
        }
    }

    updateVariables() {
        this.tableSize = this.getTableSize();
        console.log("tableSize=" + this.tableSize);
        console.log("this.measurements");
        console.log(this.measurements);
    }

    openCalculus(){
        this.expanded = !this.expanded;
    }

    static styles = 
        css`
            :host .expand {
                transform: rotate(180deg);
            }
        `;
    

    render(){
        //console.log("tableSize=" + this.tableSize)
        return !this.rows ? html``: html`
            <kor-card label=${this.label} flex-direction="row" flat>
                <kor-table condensed flex-direction="row" columns="1fr 2fr 2fr 2fr 1fr">
                    <kor-table-row slot="header">
                        <kor-table-cell head grid-cols="1" alignment="center">ID</kor-table-cell>
                        <kor-table-cell head grid-cols="1" alignment="center" style="width: 100%">Localization</kor-table-cell>
                        <kor-table-cell head grid-cols="1" alignment="center">Verbatim</kor-table-cell>
                        <kor-table-cell head grid-cols="1" alignment="center" style="width: 100%">Lymph Node</kor-table-cell>
                        <kor-table-cell head grid-cols="1" alignment="center" style="width: 100%">Basal</kor-table-cell>
                    </kor-table-row>
                    ${this.renderRows(this.rows)}
                </kor-table>
                <kor-grid flat columns="none" style="direction: rtl; flex: 2 1; overflow-x: scroll; grid-auto-flow: column; grid-auto-columns: calc(21% - 2rem); grid-template-columns: none;">
                    ${this.renderMeasurements(this.measurements, this.rows)}
                </kor-grid>



                <!--
                <kor-table condensed flex-direction="row" columns="none">
                    <kor-table-row slot="header" style="">
                        ${this.renderMeasurementDates(this.measurements)}
                    </kor-table-row>
                    ${this.renderMeasurements(this.measurements, this.rows)}
                </kor-table>
                -->
            </kor-card>
        `;
    };

    renderRows(rows){
        console.log("rows");
        console.log(rows);
        return !rows ? html``: Object.keys(rows).map(key => html`
            <kor-table-row>
                <kor-table-cell alignment="center" grid-cols="1">${rows[key].id}</kor-table-cell>
                <kor-table-cell alignment="center" grid-cols="1">${rows[key].localization}</kor-table-cell>
                <kor-table-cell alignment="center" grid-cols="1">${rows[key].verbatim}</kor-table-cell>
                <kor-table-cell alignment="center" grid-cols="1">${rows[key].lymphNode}</kor-table-cell>
                <kor-table-cell alignment="right" grid-cols="1">${rows[key].basal}</kor-table-cell>
            </kor-table-row>
        `);
    };

    renderMeasurementDates(measurements){
        //console.log("measurements");
        //console.log(Object.keys(measurements));
        return !measurements ? html``: measurements.map(measurement => html`
                <kor-table-cell head grid-cols="1" alignment="center">${measurement.date}</kor-table-cell>
        `);
    };

    renderLesions(measurements, rows){
        return !rows ? html``: Object.keys(rows).map(key => html`
            <kor-table-row>
            ${!measurements ? html``: measurements.map(measurement => html`
                <kor-table-cell grid-cols="1">${measurement.data[rows[key].id]}</kor-table-cell>
            `)}
            </kor-table-row>
        `);
    };

    renderMeasurements(measurements, rows){
            return !measurements ? html``: measurements.map(measurement => html`
                <app-measurement-target .measurement=${measurement} .rows=${rows}></app-measurement-target>
            `);
    };

    renderResponse(response){
        console.log("response");
        console.log(response);
        console.log(this.layout);
        return !response || !this.layout ? html``: html`
            <kor-table-row>
                <kor-table-cell @click=${() => this.openCalculus()} head grid-cols="${this.layout.response.span}">
                    ${this.renderIcon()}
                    Response
                 </kor-table-cell>
                ${this.renderVariables(this.measurements, "response")}
            </kor-table-row>
            ${this.renderCalculus(response)}
            `;
    }

    renderIcon(){
        return !this.calculus ? html``: html`
            <kor-icon button class="expand" icon="keyboard_arrow_down"></kor-icon>
        `;    
    }

    renderCalculus(calculus){
        return !(this.expanded && this.layout.calculus) ? html``: Object.keys(this.layout.calculus).map(calculo => html`           
            <kor-table-row>
                ${this.renderHeaders(this.layout.calculus[calculo].headers)}
                ${this.renderVariables(this.measurements, calculo)}
            </kor-table-row>
        `);
    }

    renderHeaders(headers){
        return !headers ? html``: headers.map(row => html `
            <kor-table-cell grid-cols="${row.span}">${row.name}</kor-table-cell>
        `);
    }

    renderVariables(measurements, variable){
        console.log("variable");
        console.log(this.suffix);
        console.log(variable);
        console.log(measurements);
        return !variable ? html``: measurements.map(measurement => 
            !measurement.calculus ? html ``: 
                variable=="response" ? html`
                    <kor-table-cell grid-cols="1"><kor-button style="${this.calculateColor(measurement.calculus.data[this.suffix][variable])}" label=${measurement.calculus.data[this.suffix][variable]}></kor-button></kor-table-cell>`
                    : html`
                    <kor-table-cell grid-cols="1">${measurement.calculus.data[this.suffix][variable]}</kor-table-cell>
                    `
        );

    }

    calculateColor(value) {
        if (value == "CR") {
            return "background: rgba(var(--functional-green), 1)";
        } else if (value == "PD"){
            return "background: rgba(var(--functional-red), 1)";
        } else if (value == "PR"){
            return "background: rgba(var(--functional-yellow), 1)";
        } else {
            return "background: rgba(var(--base-2), 1); color: black;";
        }

    }

    renderModal(){
        return !this.addMeasureModal ? html``: html`
            <kor-modal id="addMeasure" visible sticky label="Add Measure">
                <kor-input @value-changed=${this.changeValue("date")} label="Date" autofocus="true" type="text"></kor-input>
                ${this.renderLocalizations()}
                <kor-button slot="footer" color="secondary" label="Close" @click=${() => this.closeAddMeasure()}></kor-button>
                <kor-button slot="footer" color="primary" label="Add" @click=${() => this.saveMeasure()}></kor-button>
            </kor-modal>
        `;
    }

    renderLocalizations(){
        return !this.patient.lesions ? html``: this.patient.lesions.map(lesion => html`
            <kor-input @value-changed=${this.changeValue(lesion.id)} label="${lesion.localization}" type="text"></kor-input>
        `);
    };
}

customElements.define('app-lesions-table-2', LesionsTable);