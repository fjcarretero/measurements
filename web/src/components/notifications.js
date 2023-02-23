import '@kor-ui/kor';
import {html, LitElement} from 'lit';

class Notifications extends LitElement {
    static properties = {
        notifications: {type: Array}
    };

    constructor() {
        super();
    }

    render() {
        return html `
            <kor-card flat="true" flex-direction="row">
                ${this.notifications.map(notification => html `
                    <kor-badge .status=${notification.status}></kor-badge>
                    <kor-text size="header-1">${notification.message}</kor-text>
                `)}
            </kor-card>
        `
    }
}

customElements.define('app-notifications', Notifications);