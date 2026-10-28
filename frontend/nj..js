const teks = document.createElement("div");
teks.textContent = "Hello World";
Object.assign(teks.style, {
	position: "fixed",
	left: "0",
	top: "50%",
	transform: "translateY(-50%)",
	fontSize: "32px",
	fontFamily: "sans-serif",
	whiteSpace: "nowrap",
});
document.body.appendChild(teks);

let posisi = 0;
function gerak() {
	posisi += 2;
	if (posisi > window.innerWidth) posisi = -teks.offsetWidth;
	teks.style.left = `${posisi}px`;
	requestAnimationFrame(gerak);
}

gerak();
