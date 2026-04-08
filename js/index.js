const upload = document.getElementById("upload");
const board = document.getElementById("board");

let activeElement = null;
let offsetX = 0;
let offsetY = 0;
let zIndex = 1;

upload.addEventListener("change", (e) => {
    const files = e.target.files;

    for (let file of files) {
        const img = document.createElement("img");
        img.draggable = false;
        img.src = URL.createObjectURL(file);
        img.classList.add("image");

        // wrap image in a container
        const container = document.createElement("div");
        container.classList.add("image-container");
        container.style.position = "absolute";
        container.style.left = "100px";
        container.style.top = "100px";
        container.style.width = "100px";
        container.style.height = "100px";

        container.appendChild(img);
        board.appendChild(container);

        img.style.width = "100%";
        img.style.height = "100%";
        img.style.display = "block";

        // drag + resize
        makeDraggable(container);
        addResizeHandle(container);
    }
});

// ------------------ Drag ------------------
function makeDraggable(element) {
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

// ------------------ Resize ------------------
function addResizeHandle(container) {
    const handle = document.createElement("div");
    handle.classList.add("resize-handle");

    // handle.style.width = "0px";
    // handle.style.height = "0px";
    // handle.style.background = "transparent";
    // // handle.style.background = "url('./assets/icons8-resize-30.png')";
    // handle.style.position = "absolute";
    // handle.style.right = "0";
    // handle.style.bottom = "0";
    // handle.style.cursor = "nwse-resize";
    // handle.style.borderLeft = "10px solid transparent";
    // handle.style.borderBottom = "10px solid white";
    // handle.style.boxShadow = "-2 -2 4px black"

    handle.style.width = "20px";
    handle.style.height = "20px";
    handle.style.position = "absolute";
    handle.style.right = "0";
    handle.style.bottom = "0";
    handle.style.cursor = "nwse-resize";
    handle.style.pointerEvents = "auto";

    // add SVG arrow for visibility on any background
    handle.innerHTML = `
      <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 20L20 20L20 10" stroke="#ffffff"></path> <path d="M12 17L17 17L17 12" stroke="#ffffff"></path> </g></svg>
    `;


    container.appendChild(handle);

    makeResizable(container, handle);
}

function makeResizable(container, handle) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    handle.addEventListener("mousedown", (e) => {
        e.stopPropagation(); // prevents triggering drag
        isResizing = true;

        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(window.getComputedStyle(container).width, 10);
        startHeight = parseInt(window.getComputedStyle(container).height, 10);
    });

    document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        container.style.width = newWidth + "px";
        container.style.height = newHeight + "px";
    });

    document.addEventListener("mouseup", () => {
        isResizing = false;
    });
}