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
        addResizeHandles(container);
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
function addResizeHandles(container) {
    const handles = [
        // corners
        { pos: "top-left", size: 16, cursor: "nwse-resize", corner: true },
        { pos: "top-right", size: 16, cursor: "nesw-resize", corner: true },
        { pos: "bottom-left", size: 16, cursor: "nesw-resize", corner: true },
        { pos: "bottom-right", size: 16, cursor: "nwse-resize", corner: true },
        // sides
        { pos: "top", size: 10, cursor: "ns-resize", corner: false },
        { pos: "bottom", size: 10, cursor: "ns-resize", corner: false },
        { pos: "left", size: 10, cursor: "ew-resize", corner: false },
        { pos: "right", size: 10, cursor: "ew-resize", corner: false },
    ];

    handles.forEach(h => {
        const handle = document.createElement("div");
        handle.classList.add("resize-handle");
        handle.style.width = h.size + "px";
        handle.style.height = h.size + "px";
        handle.style.position = "absolute";
        handle.style.pointerEvents = "auto";
        handle.style.cursor = h.cursor;
        handle.style.background = h.corner ? "transparent" : "rgba(255, 255, 255, 0.41)";
        handle.style.borderRadius = "2px";

        // position handles
        if (h.pos.includes("top")) handle.style.top = "0";
        if (h.pos.includes("bottom")) handle.style.bottom = "0";
        if (h.pos.includes("left")) handle.style.left = "0";
        if (h.pos.includes("right")) handle.style.right = "0";

        // center side handles
        if (!h.corner && (h.pos === "top" || h.pos === "bottom")) {
            handle.style.left = "50%";
            handle.style.transform = "translateX(-50%)";
        }
        if (!h.corner && (h.pos === "left" || h.pos === "right")) {
            handle.style.top = "50%";
            handle.style.transform = "translateY(-50%)";
        }

        // corner SVG arrows
        if (h.corner) {
            handle.innerHTML = `
                <svg width="${h.size}" height="${h.size}"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_15_784)"> <rect width="24" height="24" fill="none"></rect> <path d="M13.8284 13.8284L20.8995 20.8995M20.8995 20.8995L20.7816 15.1248M20.8995 20.8995L15.1248 20.7816" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9.89948 13.8284L2.82841 20.8995M2.82841 20.8995L8.60312 20.7816M2.82841 20.8995L2.94626 15.1248" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M13.8284 9.8995L20.8995 2.82843M20.8995 2.82843L15.1248 2.94629M20.8995 2.82843L20.7816 8.60314" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9.89947 9.89951L2.8284 2.82844M2.8284 2.82844L2.94626 8.60315M2.8284 2.82844L8.60311 2.94629" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></path> </g> <defs> <clipPath id="clip0_15_784"> <rect width="24" height="24" fill="none"></rect> </clipPath> </defs> </g></svg>
            `;
        }

        container.appendChild(handle);
        makeResizable(container, handle, h.pos);
    });
}


function makeResizable(container, handle, pos) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop, aspectRatio;

    handle.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        isResizing = true;

        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(window.getComputedStyle(container).width, 10);
        startHeight = parseInt(window.getComputedStyle(container).height, 10);
        startLeft = container.offsetLeft;
        startTop = container.offsetTop;
        aspectRatio = startWidth / startHeight;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const isShift = e.shiftKey;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        switch (pos) {
            case "top-left":
                newWidth = startWidth - dx;
                newHeight = startHeight - dy;
                if (isShift) newHeight = newWidth / aspectRatio;
                newLeft = startLeft + (startWidth - newWidth);
                newTop = startTop + (startHeight - newHeight);
                break;
            case "top-right":
                newWidth = startWidth + dx;
                newHeight = startHeight - dy;
                if (isShift) newHeight = newWidth / aspectRatio;
                newTop = startTop + (startHeight - newHeight);
                break;
            case "bottom-left":
                newWidth = startWidth - dx;
                newHeight = startHeight + dy;
                if (isShift) newHeight = newWidth / aspectRatio;
                newLeft = startLeft + (startWidth - newWidth);
                break;
            case "bottom-right":
                newWidth = startWidth + dx;
                newHeight = startHeight + dy;
                if (isShift) newHeight = newWidth / aspectRatio;
                break;
            case "top":
                newHeight = startHeight - dy;
                newTop = startTop + (startHeight - newHeight);
                break;
            case "bottom":
                newHeight = startHeight + dy;
                break;
            case "left":
                newWidth = startWidth - dx;
                newLeft = startLeft + (startWidth - newWidth);
                break;
            case "right":
                newWidth = startWidth + dx;
                break;
        }

        container.style.width = newWidth + "px";
        container.style.height = newHeight + "px";
        container.style.left = newLeft + "px";
        container.style.top = newTop + "px";
    });

    document.addEventListener("mouseup", () => {
        isResizing = false;
    });
}