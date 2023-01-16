import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';

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

    static styles = css`
        :host(.PR) {
            backgroundcolor: greenyelow;
        }
        .PD {
            background-color: red;
        }
        .CR {
            background-color: green;
        }
        .SD {
            background-color: none;
        }
    `;
    
    constructor() {
        super();
        this.expanded = false;
    };

    getTableSize() {
        return !this.measurements ? 5 : 5 + this.measurements.length;
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
            <kor-card label=${this.label} flew-direction="row" flat style="width: 100%">
                <kor-table condensed flew-direction="row" columns="repeat(${this.tableSize}, 1fr)">
                    <kor-table-row slot="header">
                        <kor-table-cell head grid-cols="1">ID</kor-table-cell>
                        <kor-table-cell head grid-cols="1">Localization</kor-table-cell>
                        <kor-table-cell head grid-cols="1">Verbatim</kor-table-cell>
                        <kor-table-cell head grid-cols="1">Lymph3\nNode</kor-table-cell>
                        <kor-table-cell head grid-cols="1">Basal</kor-table-cell>
                        ${this.renderMeasurementDates(this.measurements)}
                    </kor-table-row>
                    ${this.renderRows(this.rows)}
                    ${this.renderResponse(this.measurements)}
                </kor-table>
            </kor-card>
        `;
    };

    renderRows(rows){
        console.log("rows");
        console.log(rows);
        return !rows ? html``: Object.keys(rows).map(key => html`
            <kor-table-row>
                <kor-table-cell grid-cols="1">${rows[key].id}</kor-table-cell>
                <kor-table-cell grid-cols="1">${rows[key].localization}</kor-table-cell>
                <kor-table-cell grid-cols="1">${rows[key].verbatim}</kor-table-cell>
                <kor-table-cell grid-cols="1">${rows[key].lymphNode}</kor-table-cell>
                <kor-table-cell grid-cols="1">${rows[key].basal}</kor-table-cell>
                ${this.renderMeasurements(this.measurements, rows[key].id)}
            </kor-table-row>
        `);
    };

    renderMeasurementDates(measurements){
        //console.log("measurements");
        //console.log(Object.keys(measurements));
        return !measurements ? html``: measurements.map(measurement => html`
                <kor-table-cell head grid-cols="1">${measurement.date}</kor-table-cell>
        `);
    };

    renderMeasurements(measurements, id){
        console.log("measurements");
        console.log(measurements);
        return !measurements ? html``: measurements.map(measurement => html`
                <kor-table-cell grid-cols="1">${measurement.data[id]}</kor-table-cell>
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

customElements.define('app-lesions-table', LesionsTable);