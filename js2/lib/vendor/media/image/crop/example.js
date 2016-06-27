function loadImageFile() {
	if (document.getElementById("uploadfile").files.length === 0) return;
	var e = document.getElementById("uploadfile").files[0];
	if (!rFilter.test(e.type)) {
		return
	}
	oFReader.readAsDataURL(e)
}
var one = new CROP;
one.init(".default");
one.loadImg("example.jpg");
$("body").on("click", "button", function() {
	$("canvas").remove();
	$(".default").after('<canvas width="240" height="240" id="canvas"/>');
	var e = document.getElementById("canvas").getContext("2d"),
		t = new Image,
		n = coordinates(one).w,
		r = coordinates(one).h,
		i = coordinates(one).x,
		s = coordinates(one).y,
		o = 240,
		u = 240;
	t.src = coordinates(one).image;
	t.onload = function() {
		e.drawImage(t, i, s, n, r, 0, 0, o, u);
		$("canvas").addClass("output").show().delay("4000").fadeOut("slow")
	}
});
$("body").on("click", ".newupload", function() {
	$(".uploadfile").click()
});
$("body").change(".uploadfile", function() {
	loadImageFile();
	$(".uploadfile").wrap("<form>").closest("form").get(0).reset();
	$(".uploadfile").unwrap()
});
oFReader = new FileReader, rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
oFReader.onload = function(e) {
	$(".example").html('<div class="default"><div class="cropMain"></div><div class="cropSlider"></div><button class="cropButton">Crop</button></div>');
	one = new CROP;
	one.init(".default");
	one.loadImg(e.target.result)
}