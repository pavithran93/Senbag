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

	$('.PhoneNumber').keyup(function() {
		var inpValue = $(this).val();
		var pattern = /^[0-9]*$/i
		if (inpValue.length == 1 && inpValue != 8 && inpValue != 9) {
			$(this).val("");
		}
		else if (!pattern.test(inpValue)) {
			$(this).val("");
		}
	});


	$('.LandlineNumber').keyup(function() {
		var inpValue = $(this).val();
		var pattern = /^[0-9]*$/i
		if (inpValue.length == 1 && inpValue != 6) {
			$(this).val("");
		}
		else if (!pattern.test(inpValue)) {
			$(this).val("");
		}
	});
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
	else {
		var pattern = /^[a-z A-Z0-9_]*$/i;
		if (!pattern.test($('#idAddress').val())) {
			$('#idAddress').addClass("ControlError");
			$('#errAddress').html("* Invalid address");
			$('#errAddress').show();
			blnError = 1;
		}
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
	else {
		var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
		if (!pattern.test($('#idEmail').val())) {
			$('#idEmail').addClass("ControlError");
			$('#errEmail').html("* Invalid email address");
			$('#errEmail').show();
			blnError = 1;
		}
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
	//$('#btnBookingSlot').click();
	tempStorage.SelectedDate = $('#idBookingDate').val();

	BookSlot("Book Slot");
}

function ValidateBackToBack() {
	var BookingDate = new Date(tempStorage.SelectedDate);
	var ServerDates = tempStorage.SlotsInfo.LastFourBookingDates;

	for (i = 0; i < tempStorage.UserSlots.length; i++) {
		var SelectedDate = tempStorage.UserSlots[i]["Selected_Date"];
		var blnMatch = false;
		for (j = 0; j < ServerDates.length; j++) {
			if (ServerDates[j] == SelectedDate) {
				blnMatch = true;
			}
		}
		if (blnMatch) {
			continue;
		}
		else {
			ServerDates.push(SelectedDate);
		}
	}

	var blnValid = false;
	var PreviousDate = new Date();
	PreviousDate.setDate(BookingDate.getDate() - 1);
	var BackToBackCount = 0;
	while (blnValid == false) {
		var PreviousDay = PreviousDate.getDate();
		var blnMatch = false;
		for (var i = 0; i < ServerDates.length; i++) {
			var CurrentDate = new Date(ServerDates[i]);
			var CurrentDateDay = CurrentDate.getDate();
			if (CurrentDateDay == PreviousDay) {
				blnMatch = true;
			}
		}
		if (blnMatch == false) {
			blnValid = true;
		}
		else {
			if (BackToBackCount >= 4) {
				blnValid = true;
			}
			else {
				BackToBackCount++;
				PreviousDate.setDate(PreviousDate.getDate() - 1);
			}
		}
	}
	if (BackToBackCount >= 4) {
		return "Cannot book continuously for 4 days"
	}
	return "";
}

function onclickSlotc(Slot) {
	//var UserSlotsPerDate = $.grep(tempStorage.UserSlots, function (n, i) {
	//    return (n.Selected_Date == tempStorage.SelectedDate)
	//});

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
	if (tempStorage.UserSlots.length >= 7) {
		alert("Maximum slot selection reached");
		return;
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
	if (parseInt(tempStorage.UserBookingTimesForMonth) > 2) {
		alert("Sorry, Maximum two bookings per month");
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

	var BookingDate = new Date(tempStorage.SelectedDate);
	var PreviousDate = new Date();
	var strPreviousDates = "";
	for (var i = 1; i <= 4; i++) {
		PreviousDate.setDate(BookingDate.getDate() - 1);
		if (strPreviousDates != "") {
			strPreviousDates += "','";
		}
		else {
			strPreviousDates += "'";
		}
		strPreviousDates += PreviousDate;
	}
	if (strPreviousDates != "") {
		strPreviousDates += "'";
	}

	var Param = {};
	Param.Action = "Fetch Slots";
	Param.Date = strDate;
	Param.NRIC = $('#idNRIC').val();
	Param.PreviousDates = strPreviousDates;
	$.ajax({
		url: '/Test/AjaxServlet',
		type: "POST",
		data: 'BodyData=' + JSON.stringify(Param),
		async: false,
		success: function(response) {
			var objResponse = response;
			tempStorage.SlotsInfo.UserBookingCountForMonth = objResponse.UserBookingCountForMonth;
			tempStorage.SlotsInfo.UserBookingTimesForMonth = objResponse.UserBookingTimesForMonth;
			tempStorage.SlotsInfo.LastFourBookingDates = objResponse.LastFourBookingDates;
			tempStorage.SlotsInfo.UserBookingForDate = objResponse.UserBookingForDate;
			tempStorage.SlotsInfo.SelectedSlotByDate = objResponse.SelectedSlotByDate;

			//Validate back to back slot
			var Message = ValidateBackToBack();
			if (Message != "") {
				OpenCustomerDetail();
				alert(Message);
			}
			else {
				InitSlots();
				$('#mdlCustomerDetail').modal('hide');
			}
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
		var blnMatch = false;
		for (j = 0; j < SelectedDateList.length; j++) {
			if (SelectedDateList[j] == SelectedDate) {
				blnMatch = true;
			}
		}
		if (blnMatch) {
			continue;
		}
		SelectedDateList.push(SelectedDate);
	}
	for (i = 0; i < SelectedDateList.length; i++) {
		var SelectedDate = SelectedDateList[i];
		var BookingData = {};
		BookingData.BookingDate = SelectedDate;
		var strBookingSlot = "";
		for (j = 0; j < tempStorage.UserSlots.length; j++) {
			if (SelectedDate == tempStorage.UserSlots[j]["Selected_Date"]) {
				if (strBookingSlot != "") {
					strBookingSlot = strBookingSlot + ",";
				}
				strBookingSlot = strBookingSlot + tempStorage.UserSlots[j]["Selected_Slot"];
			}
		}
		BookingData.BookingSlot = strBookingSlot;
		Param.BookingData.push(BookingData);
	}
	console.log(Param.BookingData);
	$.ajax({
		url: '/Test/AjaxServlet',
		type: "POST",
		data: 'BodyData=' + JSON.stringify(Param),
		success: function(response) {
			console.log(response);
			location.reload();
		},
		error: function(errorMessage) {
			alert("Ajax error");
		}
	});
}
