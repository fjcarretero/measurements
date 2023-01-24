import '@kor-ui/kor';
import {html, LitElement} from 'lit';

class AlertModal extends LitElement {
    static properties = {
        message: {}
    };

    constructor() {
        super();
    }

    dispatchCancel () {
        this.dispatchEvent(new CustomEvent('alert-cancelled', {
            bubbles: true,
            composed: true,
        }));
    }

    dispatchContinue () {
        this.dispatchEvent(new CustomEvent('alert-continued', {
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        return html `            
            <kor-modal id="Alert" visible sticky label="Alert" width="300px" height="1000">
                <kor-text size="header-2">${this.message}</kor-text>
                <kor-button slot="footer" color="secondary" label="Cancel" @click=${() => this.dispatchCancel()}></kor-button>
                <kor-button slot="footer" color="primary" label="Continue" @click=${() => this.dispatchContinue()}></kor-button>
            </kor-modal>`
    }
}
customElements.define('app-alert-modal', AlertModal);