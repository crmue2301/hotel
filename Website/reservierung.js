function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function calculateDaysBetweenDates(startDateString, endDateString) {
    var date1 = new Date(startDateString);
    var date2 = new Date(endDateString);

    var Difference_In_Time = date2.getTime() - date1.getTime();

    return Difference_In_Time / (1000 * 3600 * 24)
}

function removeReservationById(reservationId) {
    const hotels = JSON.parse(localStorage.getItem('hotels'));
    for (let i = 0; i < hotels.length; i++) {
        for (let j = 0; j < hotels[i].rooms.length; j++) {
            for (let y = 0; y < hotels[i].rooms[j].reservations.length; y++) {
                if (hotels[i].rooms[j].reservations[y].id == reservationId) {
                    hotels[i].rooms[j].reservations.splice(y, 1);
                }
            }
        }
    }

    localStorage.setItem('hotels', JSON.stringify(hotels));
}

function updateCurrentGuests() {
    let checkedinGuests = JSON.parse(localStorage.getItem('checkedinGuests'));
    if (+checkedinGuests === 0) {
        return;
    }

    let currentGuestsBody = document.getElementById("current-guests-body");

    while (currentGuestsBody.firstChild) {
        currentGuestsBody.removeChild(currentGuestsBody.firstChild);
    }

    checkedinGuests.forEach(reservation => {
        let newRow = document.createElement("tr");

        let roomNumberCell = document.createElement("td");
        roomNumberCell.textContent = reservation.roomNumber;

        let roomCategoryCell = document.createElement("td");
        roomCategoryCell.textContent = reservation.roomCategory.name;

        let firstNameCell = document.createElement("td");
        firstNameCell.textContent = reservation.vorname;

        let lastNameCell = document.createElement("td");
        lastNameCell.textContent = reservation.nachname;

        let checkinDateCell = document.createElement("td");
        checkinDateCell.textContent = reservation.checkinDate;

        let checkoutDateCell = document.createElement("td");
        checkoutDateCell.textContent = reservation.checkoutDate;

        newRow.appendChild(roomNumberCell);
        newRow.appendChild(roomCategoryCell);
        newRow.appendChild(firstNameCell);
        newRow.appendChild(lastNameCell);
        newRow.appendChild(checkinDateCell);
        newRow.appendChild(checkoutDateCell);

        currentGuestsBody.appendChild(newRow);
    });
}

function updateCurrentReservations() {
    let currentReservationsBody = document.getElementById("current-reservations-body");

    while (currentReservationsBody.firstChild) {
        currentReservationsBody.removeChild(currentReservationsBody.firstChild);
    }

    getCurrentReservations().forEach(reservation => {
        let newRow = document.createElement("tr");

        let roomNumberCell = document.createElement("td");
        roomNumberCell.textContent = reservation.roomNumber;

        let roomCategoryCell = document.createElement("td");
        roomCategoryCell.textContent = reservation.roomCategory.name;

        let firstNameCell = document.createElement("td");
        firstNameCell.textContent = reservation.vorname;

        let lastNameCell = document.createElement("td");
        lastNameCell.textContent = reservation.nachname;

        let checkinDateCell = document.createElement("td");
        checkinDateCell.textContent = reservation.checkinDate;

        let checkoutDateCell = document.createElement("td");
        checkoutDateCell.textContent = reservation.checkoutDate;

        newRow.appendChild(roomNumberCell);
        newRow.appendChild(roomCategoryCell);
        newRow.appendChild(firstNameCell);
        newRow.appendChild(lastNameCell);
        newRow.appendChild(checkinDateCell);
        newRow.appendChild(checkoutDateCell);

        currentReservationsBody.appendChild(newRow);
    });
}


function getCurrentReservations() {
    const hotels = JSON.parse(localStorage.getItem('hotels'));
    let reservations = [];
    for (let i = 0; i < hotels.length; i++) {
        for (let j = 0; j < hotels[i].rooms.length; j++) {
            for (let y = 0; y < hotels[i].rooms[j].reservations.length; y++) {
                reservations.push(hotels[i].rooms[j].reservations[y]);
            }
        }
    }

    return reservations;
}

class Aviability {
    static getAviabilityRequestData() {
        let hotelLocation = document.getElementById("verfuegbarkeit-hotellocation").value;
        if (hotelLocation == "") {
            alert("Bitte geben Sie den gewünschten Hotel-Standort an!");
            return;
        }
        let roomCategory = document.getElementById("verfuegbarkeit-roomcategory").value;
        if (roomCategory == "") {
            alert("Bitte geben Sie die gewünschte Zimmerkategorie an!");
            return;
        }
        let checkinDate = document.getElementById("verfuegbarkeit-checkindate").value;
        if (checkinDate == "") {
            alert("Bitte geben Sie das gewünschten Checkindatum an!");
            return;
        }
        let checkoutDate = document.getElementById("verfuegbarkeit-checkoutdate").value;
        if (checkoutDate == "") {
            alert("Bitte geben Sie das gewünschten Checkoutdatum an!");
            return;
        }

        if (Date.parse(checkinDate) > Date.parse(checkoutDate)) {
            alert("Ungültiger Aufenthaltszeitraum");
            return;
        }

        return new RequestData(hotelLocation, roomCategory, checkinDate, checkoutDate);
    }

    static checkAviabilityRequest(requestData) {
        const hotels = JSON.parse(localStorage.getItem('hotels'));
        let checkinDateToCheck = requestData.checkinDate;
        let checkoutDateToCheck = requestData.checkoutDate;
        for (let i = 0; i < hotels.length; i++) {
            if (hotels[i].hotelLocation === +requestData.hotelLocation) {
                for (let j = 0; j < hotels[i].rooms.length; j++) {
                    if (hotels[i].rooms[j].roomCategory.category === +requestData.roomCategory) {
                        if (hotels[i].rooms[j].reservations.length === 0) {
                            if (confirm("Zimmer verfügbar wollen Sie direkt mit der Reservierung starten?")) {
                                this.setReservationFieldsWithRequestData(requestData);
                                var reservationForm = document.getElementById("reservierung-form");
                                reservationForm.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                alert("Es sind keine Zimmer mit dieser Kategorie für den gewünschten Zeitraum verfügbar");
                            }

                            return;
                        }

                        for (let y = 0; y < hotels[i].rooms[j].reservations.length; y++) {
                            let aviable = !(((Date.parse(hotels[i].rooms[j].reservations[y].checkinDate) <= Date.parse(checkinDateToCheck) && Date.parse(hotels[i].rooms[j].reservations[y].checkoutDate) >= Date.parse(checkinDateToCheck)) && (Date.parse(hotels[i].rooms[j].reservations[y].checkinDate) <= Date.parse(checkoutDateToCheck) && Date.parse(hotels[i].rooms[j].reservations[y].checkoutDate) >= Date.parse(checkoutDateToCheck))));
                            let confirmReservation = false;
                            if (aviable) {
                                confirmReservation = true;
                            } else {
                                confirmReservation = false;
                            }

                            if (confirmReservation && hotels[i].rooms[j].reservations.length == y + 1) {
                                if (confirm("Zimmer verfügbar wollen Sie direkt mit der Reservierung starten?")) {
                                    this.setReservationFieldsWithRequestData(requestData);
                                    var reservationForm = document.getElementById("reservierung-form");
                                    reservationForm.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    alert("Es sind keine Zimmer mit dieser Kategorie für den gewünschten Zeitraum verfügbar");
                                }

                                return;
                            }
                        }
                    }
                }
            }
        }

        alert("Kein Zimmer frei ");

        return;
    }

    static handleAviabilityRequest() {
        this.checkAviabilityRequest(this.getAviabilityRequestData());
    }

    static setReservationFieldsWithRequestData(requestData) {
        let hotelLocation = document.getElementById("reservierung-hotellocation");
        let roomCategory = document.getElementById("reservierung-roomcategory");
        let checkinDate = document.getElementById("reservierung-checkindate");
        let checkoutDate = document.getElementById("reservierung-checkoutdate");
        hotelLocation.value = requestData.hotelLocation;
        roomCategory.value = requestData.roomCategory;
        checkinDate.value = requestData.checkinDate;
        checkoutDate.value = requestData.checkoutDate;
    }
}

class Reservation {
    static runningId = localStorage.getItem('runningReservationId');
    roomNumber;
    roomCategory;

    constructor(vorname, nachname, email, geburtsdatum, hotelLocation, roomCategory, checkinDate, checkoutDate, streetname, streetnumber, location, plz) {
        this.id = Reservation.runningId++;
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.geburtsdatum = geburtsdatum;
        this.guest = new Guest(vorname, nachname, email, geburtsdatum, new Address(streetname, streetnumber, location, plz));
        this.hotelLocation = hotelLocation;
        this.roomCategory = new RoomCategory(roomCategory);
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
        localStorage.setItem('runningReservationId', Reservation.runningId);
    }

    static handleReservation() {
        this.checkAviability(this.getReservierungsData());
        Checkin.generateCheckinOptions();
    }

    static getReservierungsData() {
        let vorname = document.getElementById("reservierung-vorname").value;
        if (vorname == "") {
            alert("Bitte geben Sie Ihren Vornamen ein!");
            return;
        }
        let nachname = document.getElementById("reservierung-nachname").value;
        if (nachname == "") {
            alert("Bitte geben Sie Ihren Nachnamen ein!");
            return;
        }
        let email = document.getElementById("reservierung-email").value;
        if (email == "") {
            alert("Bitte geben Sie Ihre Email-Adresse ein!");
            return;
        }
        let geburtsdatum = document.getElementById("reservierung-geburtsdatum").value;
        if (geburtsdatum == "") {
            alert("Bitte geben Sie Ihren Geburtsdatum an!");
            return;
        }
        let hotelLocation = document.getElementById("reservierung-hotellocation").value;
        if (hotelLocation == "") {
            alert("Bitte geben Sie den gewünschten Hotel-Standort an!");
            return;
        }
        let roomCategory = document.getElementById("reservierung-roomcategory").value;
        if (roomCategory == "") {
            alert("Bitte geben Sie die gewünschte Zimmerkategorie an!");
            return;
        }
        let checkinDate = document.getElementById("reservierung-checkindate").value;
        if (checkinDate == "") {
            alert("Bitte geben Sie das gewünschten Checkindatum an!");
            return;
        }
        let checkoutDate = document.getElementById("reservierung-checkoutdate").value;
        if (checkoutDate == "") {
            alert("Bitte geben Sie das gewünschten Checkoutdatum an!");
            return;
        }

        if (Date.parse(checkinDate) > Date.parse(checkoutDate)) {
            alert("Ungültiger Aufenthaltszeitraum");
            return;
        }

        let streetname = document.getElementById("reservierung-streetname").value;
        if (streetname == "") {
            alert("Bitte geben Sie Ihren Straßennamen an!");
            return;
        }
        let streetnumber = document.getElementById("reservierung-streetnumber").value;
        if (streetnumber == "") {
            alert("Bitte geben Sie Ihre Hausnummer an!");
            return;
        }
        let location = document.getElementById("reservierung-location").value;
        if (location == "") {
            alert("Bitte geben Sie Ihren Ort an!");
            return;
        }
        let plz = document.getElementById("reservierung-plz").value;
        if (plz == "") {
            alert("Bitte geben Sie Ihre PLZ an!");
            return;
        }

        let reservation = new Reservation(vorname, nachname, email, geburtsdatum, hotelLocation, roomCategory, checkinDate, checkoutDate, streetname, streetnumber, location, plz);

        return reservation;
    }

    static checkAviability(reservation) {
        // let hotelLocationToCheck = reservation.hotelLocation;
        // let roomCategoryToCheck = reservation.roomCategory;
        const hotels = JSON.parse(localStorage.getItem('hotels'));
        let checkinDateToCheck = reservation.checkinDate;
        let checkoutDateToCheck = reservation.checkoutDate;
        for (let i = 0; i < hotels.length; i++) {
            if (hotels[i].hotelLocation === +reservation.hotelLocation) {
                for (let j = 0; j < hotels[i].rooms.length; j++) {
                    if (hotels[i].rooms[j].roomCategory.category === +reservation.roomCategory.category) {
                        if (hotels[i].rooms[j].reservations.length === 0) {
                            reservation.roomNumber = hotels[i].rooms[j].roomNumber;
                            reservation.roomCategory = hotels[i].rooms[j].roomCategory;
                            hotels[i].rooms[j].reservations.push(reservation);
                            alert("Zimmer erfolgreich gebucht");
                            
                            localStorage.setItem('hotels', JSON.stringify(hotels));
                            updateCurrentReservations();

                            return true;
                        }

                        for (let y = 0; y < hotels[i].rooms[j].reservations.length; y++) {
                            let aviable = !(((Date.parse(hotels[i].rooms[j].reservations[y].checkinDate) <= Date.parse(checkinDateToCheck) && Date.parse(hotels[i].rooms[j].reservations[y].checkoutDate) >= Date.parse(checkinDateToCheck)) && (Date.parse(hotels[i].rooms[j].reservations[y].checkinDate) <= Date.parse(checkoutDateToCheck) && Date.parse(hotels[i].rooms[j].reservations[y].checkoutDate) >= Date.parse(checkoutDateToCheck))));
                            let confirmReservation = false;
                            if (aviable) {
                                confirmReservation = true;
                            } else {
                                confirmReservation = false;
                            }

                            if (confirmReservation && hotels[i].rooms[j].reservations.length == y + 1) {
                                alert("Zimmer erfolgreich gebucht");
                                reservation.roomNumber = hotels[i].rooms[j].roomNumber;
                                reservation.roomCategory = hotels[i].rooms[j].roomCategory;
                                hotels[i].rooms[j].reservations.push(reservation);
                                
                                localStorage.setItem('hotels', JSON.stringify(hotels));
                                updateCurrentReservations();

                                return true;
                            }
                        }
                    }
                }
            }
        }

        alert("Es sind keine Zimmer mit dieser Kategorie für den gewünschten Zeitraum verfügbar");
        return false;
    }
}

class RequestData {
    constructor(hotelLocation, roomCategory, checkinDate, checkoutDate) {
        this.hotelLocation = hotelLocation;
        this.roomCategory = roomCategory;
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
    }

}

class Checkout {
    static generateCheckoutOptions() {
        let checkedinGuests = JSON.parse(localStorage.getItem('checkedinGuests'));
        let checkedoutSelect = document.getElementById("checkout-checkedinSelect");

        removeOptions(checkedoutSelect);
        let hotelLocation = +document.getElementById("checkout-hotellocation").value;
        for (let i = 0; i < checkedinGuests.length; i++) {
            if (+checkedinGuests[i].hotelLocation === hotelLocation) {
                let checkoutOption = document.createElement('option');
                checkoutOption.value = JSON.stringify(checkedinGuests[i]);
                checkoutOption.innerHTML = checkedinGuests[i].id + " " + checkedinGuests[i].vorname + " " + checkedinGuests[i].nachname + " " + checkedinGuests[i].checkinDate + " - " + checkedinGuests[i].checkoutDate;

                checkoutOption.setAttribute('data-reservation', JSON.stringify(checkedinGuests[i]));

                checkedoutSelect.appendChild(checkoutOption);
            }
        }
    }

    static doCheckout() {
        let checkedinSelect = document.getElementById("checkout-checkedinSelect");
        // let reservationSelect = document.getElementById("checkin-reservationselect");
        let selectedIndex = checkedinSelect.selectedIndex;

        if (selectedIndex !== -1) {
            let checkedinSelectOption = checkedinSelect.options[selectedIndex];
            let reservationData = checkedinSelectOption.getAttribute('data-reservation');
            let reservationObject = JSON.parse(reservationData);
            // checkedinGuests.push(reservationObject);
            checkedinSelect.remove(selectedIndex);
            checkedinGuests = checkedinGuests.filter(reservation => reservation.id !== reservationObject.id);
            // alert(reservationObject.vorname + " " + reservationObject.nachname + " erfolgreich ausgechekt");
            this.printBill(reservationObject);
        }

        updateCurrentReservations();
        updateCurrentGuests();
    }

    static printBill(reservation) {
        let numberOfDays = calculateDaysBetweenDates(reservation.checkinDate, reservation.checkoutDate);
        let price = numberOfDays * reservation.roomCategory.price;

        alert("Rechnung: " + numberOfDays + " Tage" + " " + "verbracht in" + " " + reservation.roomCategory.category + " " + "zu einem Preis von" + " " + reservation.roomCategory.price + " " + "Gesamtbetrag: " + price + " " + "���");
    }
}

class Checkin {
    static generateCheckinOptions() {
        const hotels = JSON.parse(localStorage.getItem('hotels'));
        let reservationSelect = document.getElementById("checkin-reservationselect");
        removeOptions(reservationSelect);
        let hotelLocation = +document.getElementById("checkin-hotellocation").value;

        for (let i = 0; i < hotels.length; i++) {
            if (hotels[i].hotelLocation === hotelLocation) {
                for (let j = 0; j < hotels[i].rooms.length; j++) {
                    for (let y = 0; y < hotels[i].rooms[j].reservations.length; y++) {
                        let checkinOption = document.createElement('option');
                        checkinOption.value = y;
                        checkinOption.innerHTML = hotels[i].rooms[j].reservations[y].id + " " + hotels[i].rooms[j].reservations[y].vorname + " " + hotels[i].rooms[j].reservations[y].nachname + " " + hotels[i].rooms[j].reservations[y].checkinDate + " - " + hotels[i].rooms[j].reservations[y].checkoutDate;

                        checkinOption.setAttribute('data-reservation', JSON.stringify(hotels[i].rooms[j].reservations[y]));

                        reservationSelect.appendChild(checkinOption);
                    }
                }
            }
        }
    }

    static doCheckin() {
        console.log(localStorage.getItem('checkedinGuests'));
        if (+localStorage.getItem('checkedinGuests') !== 0) { 
            var checkedinGuests = JSON.parse(localStorage.getItem('checkedinGuests'));
        }else{
            var checkedinGuests = [];
        }
        let reservationSelect = document.getElementById("checkin-reservationselect");
        let selectedIndex = reservationSelect.selectedIndex;

        if (selectedIndex !== -1) {
            let reservationSelectOption = reservationSelect.options[selectedIndex];
            let reservationData = reservationSelectOption.getAttribute('data-reservation');
            let reservationObject = JSON.parse(reservationData);

            checkedinGuests.push(reservationObject);
            localStorage.setItem('checkedinGuests', JSON.stringify(checkedinGuests));

            removeReservationById(reservationObject.id);
            reservationSelect.remove(selectedIndex);
            alert(reservationObject.vorname + " " + reservationObject.nachname + " erfolgreich eingecheckt");
        }

        updateCurrentReservations();
        updateCurrentGuests();
        Checkout.generateCheckoutOptions();
    }

    // static getCheckedinGuests() {
    //     const hotels = JSON.parse(localStorage.getItem('hotels'));
    //     let checkedinGuests = [];
    //     for (let i = 0; i < hotels.length; i++) {
    //         for (let j = 0; j < hotels[i].rooms.length; j++) {
    //             for (let y = 0; y < hotels[i].rooms[j].reservations.length; y++) {
    //                 checkedinGuests.push(hotels[i].rooms[j].reservations[y]);
    //             }
    //         }
    //     }

    //     return checkedinGuests;
    // }
}

// static checkAviability(reservation) {
//     for (let i = 0; i < reservations.length; i++) {
//         if ((reservation.checkinDate.getTime() <= reservations[i].checkinDate.getTime() && check.getTime() >= reservations[i].checkoutDate.getTime())) {
//             return false;
//         }
//     }

//     return true;
// }


class Guest {
    constructor(vorname, nachname, email, geburtsdatum, streetname, streetnumber, location, plz) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.geburtsdatum = geburtsdatum;
        this.address = new Address(streetname, streetnumber, location, plz);
    }
}

class Address {
    constructor(streetname, streetnumber, location, plz) {
        this.streetname = streetname;
        this.streetnumber = streetnumber;
        this.location = location;
        this.plz = plz;
    }
}

class Hotel {
    constructor(hotelLocation, rooms) {
        this.hotelLocation = hotelLocation;
        this.rooms = rooms;

    }
}

class Room {
    constructor(roomNumber, roomCategory, reservations) {
        this.roomNumber = roomNumber;
        this.roomCategory = roomCategory;
        this.reservations = reservations;
    }
}

class RoomCategory {
    constructor(category) {
        this.category = category;
        switch (+category) {
            case 1:
                this.price = 100; break;
            case 2:
                this.price = 200; break;
            case 3:
                this.price = 300; break;
            default:
                console.log("roomCategory not found"); break;
        }
        switch (+category) {
            case 1:
                this.name = "Standard-Zimmer"; break;
            case 2:
                this.name = "Economy-Zimmer"; break;
            case 3:
                this.name = "Premium-Zimmer"; break;
            default:
                console.log("roomCategory not found"); break;
        }
    }
}

function loadEmptyData() {
    const roomsHotel1 = [new Room(1, new RoomCategory(1), []), new Room(2, new RoomCategory(2), []), new Room(3, new RoomCategory(3), []), new Room(4, new RoomCategory(1), []), new Room(5, new RoomCategory(2), []), new Room(6, new RoomCategory(3), [])];
    const roomsHotel2 = [new Room(1, new RoomCategory(1), []), new Room(2, new RoomCategory(2), []), new Room(3, new RoomCategory(3), []), new Room(4, new RoomCategory(1), []), new Room(5, new RoomCategory(2), []), new Room(6, new RoomCategory(3), [])];
    const roomsHotel3 = [new Room(1, new RoomCategory(1), []), new Room(2, new RoomCategory(2), []), new Room(3, new RoomCategory(3), []), new Room(4, new RoomCategory(1), []), new Room(5, new RoomCategory(2), []), new Room(6, new RoomCategory(3), [])];
    const hotels = [new Hotel(1, roomsHotel1), new Hotel(2, roomsHotel2), new Hotel(3, roomsHotel3)];
    // var checkedinGuests = [];
    // var reservations = [];

    const isReservationsSet = localStorage.getItem('hotels') !== null;
    const hasRunningReservationId = localStorage.getItem('runningReservationId') !== null;
    const hasCheckedinGuests = localStorage.getItem('checkedinGuests')!== null;

    if (!isReservationsSet) {
        localStorage.setItem('hotels', JSON.stringify(hotels));
    }

    if (!hasRunningReservationId) {
        localStorage.setItem('runningReservationId', 0);
    }

    if (!hasCheckedinGuests) {
        localStorage.setItem('checkedinGuests', 0);
    }

    Reservation.runningId = localStorage.getItem('runningReservationId');


    updateCurrentReservations();
    updateCurrentGuests();
}