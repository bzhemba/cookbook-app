export class SSENotifier {

    constructor(options = {}) {
        this.options = {
            eventSourceUrl: options.eventSourceUrl,
            channel: options.channel,
            onMessage: options.onMessage || (() => {
            }),
            onError: options.onError || (() => {
            }),
            reconnectDelay: options.reconnectDelay || 5000,
            eventListeners: options.eventListeners || {},
        };

        this.eventSource = null;
        this.connect();
    }

    connect() {
        if (this.eventSource) {
            this.eventSource.close();
        }

        const {eventSourceUrl, channel, onMessage, onError, eventListeners} = this.options;
        const url = `${eventSourceUrl}/${channel}`;
        this.eventSource = new EventSource(url);

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('SSE data parse error:', error);
            }
        };

        Object.entries(eventListeners).forEach(([eventName, callback]) => {
            this.eventSource.addEventListener(eventName, (event) => {
                try {
                    const data = JSON.parse(event.data);
                    callback(data);
                } catch (error) {
                    console.error(`SSE event "${eventName}" parse error:`, error);
                }
            });
        });

        this.eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            onError(error);
            setTimeout(() => this.connect(), this.options.reconnectDelay);
        };
    }

    close() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }
}