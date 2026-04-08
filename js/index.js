const upload = document.getElementById("upload");
const board = document.getElementById("board");

upload.addEventListener("change", (e) => {
    const files = e.target.files;

    for (let file of files) {
        const img = document.createElement("img");
        img.draggable = false;
        img.src = URL.createObjectURL(file);
        img.classList.add("image");

        img.style.left = "100px";
        img.style.top = "100px";
        img.style.width = "100px"

        board.appendChild(img);


        // drag system
        makeDraggable(img)
    }
})

let activeElement = null;
let offsetX = 0;
let offsetY = 0;
let zIndex = 1;

function makeDraggable(element) {
    // mousedown event 
    element.addEventListener("mousedown", (e) => {
        e.preventDefault(); // prevent default image drag / selection
        activeElement = element;

        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;

        zIndex++;
        element.style.zIndex = zIndex;
        element.style.cursor = "grabbing";

    });
}

document.addEventListener("mousemove", (e) => {
    if (!activeElement) return;

    activeElement.style.left = e.clientX - offsetX + "px";
    activeElement.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
    if (activeElement) {
        activeElement.style.cursor = "grab";
    }
    activeElement = null;
});