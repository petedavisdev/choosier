export function windowHeightFix() {
	if (window.innerHeight < document.body.scrollHeight) {
		setWindowHeight();
		setTimeout(() => {
			setWindowHeight();
		}, 500);
		window.onresize = () => delayedAction(setWindowHeight);
	}
}

let act: NodeJS.Timeout;

function delayedAction(action: () => void) {
	clearTimeout(act);
	act = setTimeout(() => {
		action();
	}, 200);
}

function setWindowHeight() {
	document.documentElement.style.setProperty(
		'--windowHeight',
		`${window.innerHeight}px`
	);
}
