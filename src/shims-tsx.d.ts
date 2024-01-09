declare global {
	namespace JSX {}
	namespace TSX {}
	interface Window {
		ws: null | WebSocket;
	}
}
