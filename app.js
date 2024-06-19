document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function (e) {
        e.preventDefault();
        startButton.classList.add("animate");

        setTimeout(() => {
            startButton.classList.remove("animate");
        }, 600); // 1s = 1000ms
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const offcanvasLinks = document.querySelectorAll('.offcanvas a[href^="#"]');
    offcanvasLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const offcanvas = bootstrap.Offcanvas.getInstance(document.querySelector('#offcanvasNavbar'));
            if (offcanvas) {
                offcanvas.hide();
            }
        });
    });
});

document.getElementById('startButton').addEventListener('click', function () {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener("DOMContentLoaded", function () {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('active');
        }, index * 300); // Adjust the delay as needed
    });
});

var form = document.getElementById("myForm"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    userName = document.getElementById("name"),
    type = document.getElementById("type"),
    price = document.getElementById("price"),
    link = document.getElementById("link"),
    submitBtn = document.querySelector(".submit"),
    userInfo = document.getElementById("data"),
    modal = document.getElementById("userForm"),
    modalTitle = document.querySelector("#userForm .modal-title"),
    newUserBtn = document.querySelector(".newUser");

let getData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : [];

let isEdit = false, editId;
showInfo();

newUserBtn.addEventListener('click', () => {
    submitBtn.innerText = 'Submit';
    modalTitle.innerText = "Fill the Form";
    isEdit = false;
    imgInput.src = "./asset/img/Profile Icon.webp";
    form.reset();
});

file.onchange = function () {
    if (file.files[0].size < 1000000) {  // 1MB = 1000000
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
            imgUrl = e.target.result;
            imgInput.src = imgUrl;
        }

        fileReader.readAsDataURL(file.files[0]);
    }
    else {
        alert("This file is too large!");
    }
};

function showInfo() {
    document.querySelectorAll('.employeeDetails').forEach(info => info.remove());
    getData.forEach((element, index) => {
        let createElement = `<tr class="employeeDetails">
            <td>${index + 1}</td>
            <td><img src="${element.picture}" alt="" width="50" height="50"></td>
            <td>${element.itemName}</td>
            <td>${element.itemType}</td>
            <td>${element.itemPrice}</td>
            <td><a href="${element.itemLink}" target="_blank">${element.itemLink}</a></td>
            <td>
                <button class="btn btn-success" onclick="readInfo('${element.picture}', '${element.itemName}', '${element.itemType}', '${element.itemPrice}', '${element.itemLink}')" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>
                <button class="btn btn-primary" onclick="editInfo(${index}, '${element.picture}', '${element.itemName}', '${element.itemType}', '${element.itemPrice}', '${element.itemLink}')" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger" onclick="deleteInfo(${index})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;

        userInfo.innerHTML += createElement;
    });
}
showInfo();

function readInfo(pic, name, type, price, link) {
    document.querySelector('.showImg').src = pic;
    document.querySelector('#showName').value = name;
    document.querySelector("#showType").value = type;
    document.querySelector("#showPrice").value = price;
    document.querySelector("#showLink").value = link;
}

function editInfo(index, pic, name, Type, Price, Link) {
    isEdit = true;
    editId = index;
    imgInput.src = pic;
    userName.value = name;
    type.value = Type;
    price.value = Price;
    link.value = Link;

    submitBtn.innerText = "Update";
    modalTitle.innerText = "Update The Items";
}

function deleteInfo(index) {
    if (confirm("Are you sure want to delete?")) {
        getData.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(getData));
        showInfo();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        picture: imgInput.src == undefined ? "./asset/img/Profile Icon.webp" : imgInput.src,
        itemName: userName.value,
        itemType: type.value,
        itemPrice: price.value,
        itemLink: link.value
    };

    if (!isEdit) {
        getData.push(information);
    }
    else {
        isEdit = false;
        getData[editId] = information;
    }

    localStorage.setItem('userProfile', JSON.stringify(getData));

    submitBtn.innerText = "Submit";
    modalTitle.innerHTML = "Fill The Form";

    showInfo();

    form.reset();

    imgInput.src = "./asset/img/Profile Icon.webp";

    // modal.style.display = "none"
    // document.querySelector(".modal-backdrop").remove()
});

function formatRupiah(angka, prefix) {
    var number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp ' + rupiah : '');
}

price.addEventListener('keyup', function (e) {
    price.value = formatRupiah(this.value, 'Rp ');
});
