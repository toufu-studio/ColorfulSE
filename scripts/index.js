const sounds = {};
const defaultColors = {
	1: "#e74c3c",
	2: "#2ecc71",
	3: "#f39c12",
	4: "#3498db",
	5: "#9b59b6",
	6: "#34495e",
	7: "#1abc9c",
	8: "#e67e22",
	9: "#7f8c8d",
};
let removeSoundMode = false;
let addSoundMode = false;

function playSound(number) {
	if (removeSoundMode) {
		removeSound(number);
		removeSoundMode = false;
		return;
	}

	if (addSoundMode) {
		addSound(number);
		addSoundMode = false;
		return;
	}

	if (sounds[number]) {
		const soundClone = new Audio(sounds[number].src);
		soundClone.currentTime = 0;
		soundClone.play().catch((error) => console.error(error));

		// 音符を追加
		createNote();
	}
}

function createNote() {
	const note = document.createElement("div");
	note.classList.add("note");

	const randomNoteEntity = getRandomNoteEntity();
	note.innerHTML = randomNoteEntity;

	note.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
	note.style.top = `${Math.random() * (window.innerHeight - 40)}px`;

	note.style.color = getRandomColor();

	document.body.appendChild(note);

	note.addEventListener("animationend", () => {
		note.remove();
	});
}

function getRandomNoteEntity() {
	const noteEntities = ["♩", "♫", "♪", "♬"];
	return noteEntities[Math.floor(Math.random() * noteEntities.length)];
}

function addSoundButton() {
	addSoundMode = true;
	alert("効果音を追加したいボタンをクリックしてください。");
}

function addSound(newSoundKey) {
	if (newSoundKey && !sounds[newSoundKey] && /^[1-9]$/.test(newSoundKey)) {
		document.getElementById("file-input").click();

		document.getElementById("file-input").onchange = function (event) {
			const file = event.target.files[0];
			if (file) {
				const newSoundURL = URL.createObjectURL(file);
				sounds[newSoundKey] = new Audio(newSoundURL);

				const newButton = createButton(newSoundKey);

				document
					.querySelector(".grid")
					.replaceChild(
						newButton,
						document.querySelector(`.sound-button[data-key="${newSoundKey}"]`),
					);

				if (defaultColors[newSoundKey]) {
					newButton.style.backgroundColor = defaultColors[newSoundKey];
				} else {
					defaultColors[newSoundKey] = getRandomColor();
					newButton.style.backgroundColor = defaultColors[newSoundKey];
				}
			}
		};
	} else {
		alert(
			"既に追加されているか、番号が間違っている可能性があります。\n効果音を削除してから再度お試しください。",
		);
	}
}

function removeSoundButton() {
	removeSoundMode = true;
	alert("削除したい効果音のボタンをクリックしてください。");
}

function removeSound(soundKeyToRemove) {
	if (
		soundKeyToRemove &&
		sounds[soundKeyToRemove] &&
		/^[1-9]$/.test(soundKeyToRemove)
	) {
		delete sounds[soundKeyToRemove];

		const soundButton = document.querySelector(
			`.sound-button[data-key="${soundKeyToRemove}"]`,
		);
		if (soundButton) {
			soundButton.setAttribute("data-key", soundKeyToRemove);
			soundButton.style.backgroundColor = defaultColors[soundKeyToRemove];
		}
	} else {
		alert(
			"既に追加されているか、番号が間違っている可能性があります。\n効果音が既に削除されているか確認して再度お試しください。",
		);
	}
}

function createButton(key) {
	const newButton = document.createElement("button");
	newButton.classList.add("sound-button");
	newButton.setAttribute("data-key", key);
	newButton.innerHTML = key;
	newButton.onclick = () => playSound(key);
	return newButton;
}

function uploadSound() {
	const fileInput = document.getElementById("file-input");
	if (fileInput.files.length > 0) {
		const newSoundKey = prompt(
			"効果音を割り当てる番号を入力してください（1から9）",
		);
		if (newSoundKey && !sounds[newSoundKey] && /^[1-9]$/.test(newSoundKey)) {
			const file = fileInput.files[0];
			const newSoundURL = URL.createObjectURL(file);
			sounds[newSoundKey] = new Audio(newSoundURL);

			const newButton = createButton(newSoundKey);

			document
				.querySelector(".grid")
				.replaceChild(
					newButton,
					document.querySelector(`.sound-button[data-key="${newSoundKey}"]`),
				);

			if (defaultColors[newSoundKey]) {
				newButton.style.backgroundColor = defaultColors[newSoundKey];
			} else {
				defaultColors[newSoundKey] = getRandomColor();
				newButton.style.backgroundColor = defaultColors[newSoundKey];
			}
		} else {
			alert("有効な番号を入力してください（1から9）");
		}
	}
}

function changeButtonColors() {
	const buttonKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
	buttonKeys.forEach((key) => {
		const soundButton = document.querySelector(
			`.sound-button[data-key="${key}"]`,
		);
		if (soundButton) {
			const randomColor = getRandomColor();
			soundButton.style.backgroundColor = randomColor;
			defaultColors[key] = randomColor;
		}
	});
}

function getRandomColor() {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
