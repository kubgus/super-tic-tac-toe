import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const Game = document.getElementById("game");
const Fields = document.getElementsByClassName("field");
const Cells = document.getElementsByClassName("cell");
const TurnTextTop = document.getElementById("turnt");
const TurnTextBottom = document.getElementById("turnb");

// player properties
const Players = [
    { symbol: "■", color: "rgb(0, 106, 255)", color_name: "blue" },
    { symbol: "■", color: "red", color_name: "red" }
];

// turn management
let turn = Math.round(Math.random());
setTurnText(getTurnText(Players[turn].symbol, Players[turn].color));

// win condition
let win = false;
let playing = true;

for (const cell of Cells) {
    cell.addEventListener("click", () => {
        if (!playing) return;
        const cell_index = Array.from(cell.parentElement.children).indexOf(cell);
        const field_index = Array.from(cell.parentElement.parentElement.children).indexOf(cell.parentElement);

        const field = Game.children[field_index];

        if (!win) {
            if (!cell.classList.contains("red") && !cell.classList.contains("blue") && !cell.classList.contains("locked")) {
                cell.classList.add(Players[turn].color_name);

                // check local win condition
                const checked_cells = Array.from(field.children).map((cell) => cell.classList.contains(Players[turn].color_name));
                if (checked_cells[0] && checked_cells[1] && checked_cells[2] ||
                    checked_cells[3] && checked_cells[4] && checked_cells[5] ||
                    checked_cells[6] && checked_cells[7] && checked_cells[8] ||
                    checked_cells[0] && checked_cells[3] && checked_cells[6] ||
                    checked_cells[1] && checked_cells[4] && checked_cells[7] ||
                    checked_cells[2] && checked_cells[5] && checked_cells[8] ||
                    checked_cells[0] && checked_cells[4] && checked_cells[8] ||
                    checked_cells[2] && checked_cells[4] && checked_cells[6]) {
                    confetti();
                    field.classList.add(Players[turn].color_name);
                }

                // check global win condition
                const checked_fields = Array.from(Game.children).map((field) => field.classList.contains(Players[turn].color_name));
                if (checked_fields[0] && checked_fields[1] && checked_fields[2] ||
                    checked_fields[3] && checked_fields[4] && checked_fields[5] ||
                    checked_fields[6] && checked_fields[7] && checked_fields[8] ||
                    checked_fields[0] && checked_fields[3] && checked_fields[6] ||
                    checked_fields[1] && checked_fields[4] && checked_fields[7] ||
                    checked_fields[2] && checked_fields[5] && checked_fields[8] ||
                    checked_fields[0] && checked_fields[4] && checked_fields[8] ||
                    checked_fields[2] && checked_fields[4] && checked_fields[6]) {
                    win = true;
                }

                // lock fields
                removeTemporaryClasses();
                if (!Game.children[cell_index].classList.contains(Players[opposite(turn)].color_name)) {
                    for (const field of Fields) {
                        if (Array.from(field.parentElement.children).indexOf(field) != cell_index) {
                            field.classList.add("locked");
                        }
                    }
                }

                // change turn player
                turn = opposite(turn);
                setTurnText(getTurnText(Players[turn].symbol, Players[turn].color));
            }
        }

        if (win) {
            setTurnText(`🏆 <span style="color:${Players[opposite(turn)].color};">${Players[opposite(turn)].symbol}</span> 🏆`);
            removeTemporaryClasses();
            confetti();
            playing = false;
        }
    });
}

function opposite(turn) {
    return turn == 0 ? 1 : 0;
}

function setTurnText(text) {
    TurnTextTop.innerHTML = text;
    TurnTextBottom.innerHTML = text;
}

function getTurnText(symbol, color) {
    return `↓ <span style="color:${color};">${symbol}</span> ↓`
}

function removeTemporaryClasses() {
    for (const testedField of Fields) {
        if (testedField.classList.contains("locked")) testedField.classList.remove("locked");
    }
}