export type EventHandler = (data?: any) => void

export class WebSocketEmitter {
    private url: string
    private ws?: WebSocket
    private handlers: {[key: string]: EventHandler[]} = {}
    public onOpen?: () => void

    constructor(url: string) {
        this.url = url;
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = (e: any) => {
            const msg = JSON.parse(e.data)
            console.log('got message', msg)
            const handlers = this.handlers[msg.event]
            if (handlers) {
                for (const h of handlers) {
                    try {
                        h(msg.data)
                    } catch (e) {
                        console.error('Error when handling msg', msg)
                    }
                }
            }
        }
        this.ws.onopen = () => {
            if (this.onOpen) {
                this.onOpen()
            }
        }
        this.ws.onerror = (e: any) => {
            console.log('WebSocket error, reconnect', e)
            this.ws?.close();
            this.connect();
        }
    }

    disconnect() {
        this.ws?.close()
    }

    send(event: string, data?: any) {
        return this.ws?.send(JSON.stringify({
            event,
            data,
        }))
    }

    on(event: string, handler: EventHandler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    }
}