var tempStorage = {};

$(function() {
	InitPage();

	$("#idUsageTrade").on("change", function() {
		var strUsageTrade = $(this).val();
		if (strUsageTrade == "Others") {
			$('.Others').show();
		}
		else {
			$('.Others').hide();
		}
	})
});

function InitPage() {
	tempStorage.SlotsInfo = {};
	tempStorage.UserSlots = [];

	$('#idUsageTrade').val("FB");
	OpenCustomerDetail();

	InitSlots();
}

function InitSlots() {
	BindUserDate();

	UpdateSlotSlection();
}

function BindUserDate() {
	tempStorage.UserBookingCountForMonth = tempStorage.SlotsInfo.UserBookingCountForMonth;


	tempStorage.UserBookedSlots = [];
	var strUserBookingForDate = tempStorage.SlotsInfo.UserBookingForDate;
	if (strUserBookingForDate != null && strUserBookingForDate != "") {
		var arrUserBookingForDate = strUserBookingForDate.split(',');
		for (i = 0; i < arrUserBookingForDate.length; i++) {
			tempStorage.UserBookedSlots.push(arrUserBookingForDate[i]);
		}
	}

	tempStorage.BookedSlots = [];
	var strSelectedSlotByDate = tempStorage.SlotsInfo.SelectedSlotByDate;
	if (strSelectedSlotByDate != null && strSelectedSlotByDate != "") {
		var arrSelectedSlotByDate = strSelectedSlotByDate.split(',');
		for (i = 0; i < arrSelectedSlotByDate.length; i++) {
			tempStorage.BookedSlots.push(arrSelectedSlotByDate[i]);
		}
	}
}

function OpenCustomerDetail() {
	$('#idNRIC').removeAttr("disabled");
	if (tempStorage.UserSlots.length > 0) {
		$('#idNRIC').attr("disabled", true);
	}
	$('#mdlCustomerDetail').modal('show');
}

function onclickBookSlot() {
	$('#idName').removeClass("ControlError");
	$('#errName').hide();
	$('#idAddress').removeClass("ControlError");
	$('#errAddress').hide();
	$('#idNRIC').removeClass("ControlError");
	$('#errNRIC').hide();
	$('#idUsageTrade').removeClass("ControlError");
	$('#errUsageTrade').hide();
	$('#idOthers').removeClass("ControlError");
	$('#errOthers').hide();
	$('#idEmail').removeClass("ControlError");
	$('#errEmail').hide();
	$('#idHomeTel').removeClass("ControlError");
	$('#errHomeTel').hide();
	$('#idOfficeTel').removeClass("ControlError");
	$('#errOfficeTel').hide();
	$('#idMobile').removeClass("ControlError");
	$('#errMobile').hide();
	$('#idBookingDate').removeClass("ControlError");
	$('#errBookingDate').hide();
	var blnError = 0;
	if ($('#idName').val() == "") {
		$('#idName').addClass("ControlError");
		$('#errName').html("* Please enter your name");
		$('#errName').show();
		blnError = 1;
	}
	if ($('#idAddress').val() == "") {
		$('#idAddress').addClass("ControlError");
		$('#errAddress').html("* Please enter your address");
		$('#errAddress').show();
		blnError = 1;
	}
	if ($('#idNRIC').val() == "") {
		$('#idNRIC').addClass("ControlError");
		$('#errNRIC').html("* Please enter your NRIC");
		$('#errNRIC').show();
		blnError = 1;
	}
	if ($('#idUsageTrade').val() == "") {
		$('#idUsageTrade').addClass("ControlError");
		$('#errUsageTrade').html("* Please select usage trade");
		$('#errUsageTrade').show();
		blnError = 1;
	}
	if ($('#idUsageTrade').val() == "Others" && $('#idOthers').val() == "") {
		$('#idOthers').addClass("ControlError");
		$('#errOthers').html("* Please enter usage trade details");
		$('#errOthers').show();
		blnError = 1;
	}
	if ($('#idEmail').val() == "") {
		$('#idEmail').addClass("ControlError");
		$('#errEmail').html("* Please enter your email");
		$('#errEmail').show();
		blnError = 1;
	}
	if ($('#idHomeTel').val() == "") {
		$('#idHomeTel').addClass("ControlError");
		$('#errHomeTel').html("* Please enter your home number");
		$('#errHomeTel').show();
		blnError = 1;
	}
	if ($('#idOfficeTel').val() == "") {
		$('#idOfficeTel').addClass("ControlError");
		$('#errOfficeTel').html("* Please enter your office number");
		$('#errOfficeTel').show();
		blnError = 1;
	}
	if ($('#idMobile').val() == "") {
		$('#idMobile').addClass("ControlError");
		$('#errMobile').html("* Please enter your mobile number");
		$('#errMobile').show();
		blnError = 1;
	}
	if ($('#idBookingDate').val() == "") {
		$('#idBookingDate').addClass("ControlError");
		$('#errBookingDate').html("* Please select booking date");
		$('#errBookingDate').show();
		blnError = 1;
	}
	if (blnError == 1) {
		return;
	}
	$('#mdlCustomerDetail').modal('hide');
	//$('#btnBookingSlot').click();
	tempStorage.SelectedDate = $('#idBookingDate').val();
	BookSlot("Book Slot");
}

function onclickSlotc(Slot) {
	//var UserSlotsPerDate = $.grep(tempStorage.UserSlots, function (n, i) {
	//    return (n.Selected_Date == tempStorage.SelectedDate)
	//});

	if (tempStorage.UserSlots.length >= 7) {
		alert("Maximum slot selection reached");
		return;
	}
	//Check Booked
	var blnSlotExist = 0;
	for (i = 0; i < tempStorage.BookedSlots.length; i++) {
		var SelectedSlot = tempStorage.BookedSlots[i];
		if (SelectedSlot == Slot) {
			blnSlotExist = 1;
			break;
		}
	}
	if (blnSlotExist == true) {
		alert("Slot not available for booking. Please select another slot");
		return;
	}

	var blnSlotExist = 0;
	for (i = 0; i < tempStorage.UserSlots.length; i++) {
		var SelectedSlot = tempStorage.UserSlots[i]["Selected_Slot"];
		if (tempStorage.SelectedDate == tempStorage.UserSlots[i]["Selected_Date"] && SelectedSlot == Slot) {
			blnSlotExist = 1;
			tempStorage.UserSlots.splice(i, 1);
			break;
		}
	}
	if (blnSlotExist == 0) {
		var objUS = {};
		objUS["Selected_Slot"] = Slot;
		objUS["Selected_Date"] = tempStorage.SelectedDate;
		tempStorage.UserSlots.push(objUS);
	}

	UpdateSlotSlection();

	CalculatePrice();
}

function UpdateSlotSlection() {
	for (i = 1; i <= 20; i++) {
		$('#divL1S' + i).removeClass("Blocked");
		$('#divL1S' + i).removeClass("Booked");
		$('#divL1S' + i).removeClass("BookedByUser");
		$('#divL1S' + i).addClass("Free");
		if (i <= 10) {
			$('#divL2S' + i).removeClass("Blocked");
			$('#divL2S' + i).removeClass("Booked");
			$('#divL2S' + i).removeClass("BookedByUser");
			$('#divL2S' + i).addClass("Free");
		}
	}
	for (i = 0; i < tempStorage.BookedSlots.length; i++) {
		var SelectedSlot = tempStorage.BookedSlots[i];
		$('#div' + SelectedSlot).addClass("Blocked");
	}

	var UserSlotsPerDate = $.grep(tempStorage.UserSlots, function(n, i) {
		return (n.Selected_Date == tempStorage.SelectedDate)
	});
	for (i = 0; i < UserSlotsPerDate.length; i++) {
		var SelectedSlot = UserSlotsPerDate[i]["Selected_Slot"];
		$('#div' + SelectedSlot).addClass("Booked");
	}
	for (i = 0; i < tempStorage.UserBookedSlots.length; i++) {
		var SelectedSlot = tempStorage.UserBookedSlots[i];
		$('#div' + SelectedSlot).removeClass("Blocked");
		$('#div' + SelectedSlot).addClass("BookedByUser");
	}
}

function CalculatePrice() {
	var datBookingDate = new Date(tempStorage.SelectedDate);
	var arrDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var strDayName = arrDays[datBookingDate.getDay()];
	var decTotalPrice = 0;

	var blnWeekEnd = false;
	if (strDayName == "Saturday" || strDayName == "Sunday") {
		blnWeekEnd = true;
	}
	for (i = 0; i < tempStorage.UserSlots.length; i++) {
		var SelectedSlot = tempStorage.UserSlots[i]["Selected_Slot"];
		var decPrice = 0;
		if (SelectedSlot.indexOf("L1") >= 0) {
			decPrice = 40;
			if (blnWeekEnd == true) {
				decPrice = 60;
			}
		}
		else if (SelectedSlot.indexOf("L2") >= 0) {
			decPrice = 30;
			if (blnWeekEnd == true) {
				decPrice = 40;
			}
		}
		decTotalPrice = decTotalPrice + decPrice;
	}
	$('#divTotalPrice').html("$ " + decTotalPrice.toFixed(2));
	$('#hdnTotalAmount').val(decTotalPrice);
}

function onclickSubmit() {
	if (tempStorage.UserSlots.length < 2) {
		alert("Please select minimum two slots");
		return;
	}
	var UserSelectionPerMonth = tempStorage.UserSlots.length + parseInt(tempStorage.UserBookingCountForMonth);
	if (UserSelectionPerMonth > 7) {
		alert("Sorry, Maximum of seven slots allowed to select");
		return;
	}
	if ($('#chkAcknowledge').prop('checked') == false) {
		alert("Please select the acknowledgement");
		return;
	}
	//$('#hdnSelectedSlots').val(tempStorage.UserSlots);
	//$('#btnSubmit').click();
	Submit();
}


function BookSlot(Action) {
	var strDate = "";
	if (Action == "Book Slot") {
		strDate = $('#idBookingDate').val();
	}
	var Param = {};
	Param.Action = "Fetch Slots";
	Param.Date = strDate;
	Param.NRIC = $('#idNRIC').val();
	$.ajax({
		url: '/Test/AjaxServlet',
		type: "POST",
		data: 'BodyData=' + JSON.stringify(Param),
		success: function(response) {
			var objResponse = response;
			tempStorage.SlotsInfo.UserBookingCountForMonth = objResponse.UserBookingCountForMonth;
			tempStorage.SlotsInfo.UserBookingForDate = objResponse.UserBookingForDate;
			tempStorage.SlotsInfo.SelectedSlotByDate = objResponse.SelectedSlotByDate;
			InitSlots();
		},
		error: function(errorMessage) {
			alert("Ajax error");
		}
	});
}

function Submit() {
	var Param = {};
	Param.Action = "Save Slots";
	Param.Name = $('#idName').val();
	Param.Address = $('#idAddress').val();
	Param.NRIC = $('#idNRIC').val();
	Param.UsageTrade = $('#idUsageTrade').val();
	Param.Others = $('#idOthers').val();
	Param.Email = $('#idEmail').val();
	Param.HomeTel = $('#idHomeTel').val();
	Param.OfficeTel = $('#idOfficeTel').val();
	Param.Mobile = $('#idMobile').val();
	Param.TotalAmount = $('#idMobile').val();
	Param.BookingData = [];
	//Group selected date
	var SelectedDateList = [];
	for (i = 0; i < tempStorage.UserSlots.length; i++) {
		var SelectedDate = tempStorage.UserSlots[i]["Selected_Date"];
		if ($.inArray(SelectedDate, SelectedDate) > -1) {
			continue;
		}
		SelectedDateList.push(SelectedDate);
	}
	for (i = 0; i < SelectedDateList.length; i++) {
		var SelectedDate = SelectedDateList[i];
		var BookingData = {};
		BookingData.BookingDate = SelectedDate;
		for (j = 0; j < tempStorage.UserSlots.length; j++) {
			if (SelectedDate == tempStorage.UserSlots[j]["Selected_Date"]) {
				BookingData.BookingSlot = tempStorage.UserSlots[j]["Selected_Slot"];
			}
		}
		Param.BookingData.push(BookingData);
	}
	console.log(Param.BookingData);
	$.ajax({
		url: '/Test/AjaxServlet',
		type: "POST",
		data: 'BodyData=' + JSON.stringify(Param),
		success: function(response) {
			console.log(response);
		},
		error: function(errorMessage) {
			alert("Ajax error");
		}
	});
}