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

function makeDraggable(element) {
    let activeElement = null;
    let offsetX = 0;
    let offsetY = 0;

    let isDragging = false;
    let zIndex = 1;


    // mousedown event 
    element.addEventListener("mousedown", (e) => {
        isDragging = true;

        // calc offset inside img 
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;

        // e.client -> mouse position 
        // offsetX is where we click inside img 

        element.style.cursor = "grabbing";

        // layering stack images so clicked images come to the front
        zIndex++;
        element.style.zIndex = zIndex;

    });

    // mousemove event 
    element.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        element.style.left = e.clientX - offsetX + "px";
        element.style.top = e.clientY - offsetY + "px";
    })

    // mouseup event 
    element.addEventListener("mouseup", (e) => {
        isDragging = false;
        element.style.cursor = "grab";
    });
}