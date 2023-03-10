"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);

  async function formSend(e) {
    e.preventDefault();
    let error = formValidate(form);

    let formData = new FormData(form);
    formData.append("image", formImage.files[0]); //добавление изображения к данным из формы

    if (error === 0) {
      //форма прошла валидацию

      form.classList.add("_sending");
      let response = await fetch("sendmail.php", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        let result = await response.json();
        alert(result.message);
        //очищение формы после отправки
        formPreviev.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
      } else {
        alert("Ошибка");
        form.classList.remove("_sending");
      }
    } else {
      alert("Заполните обязательные поля");
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll("._req");

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.classList.contains("_email")) {
        if (emailTest(input)) {
          formAddError(input);
          error++;
        }
      } else if (
        input.getAttribute("type") === "checkbox" &&
        input.checked === false
      ) {
        formAddError(input);
        error++;
      } else {
        if (input.value == "") {
          formAddError(input);
          error++;
        }
      }
    }
    return error;
  }
  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
  }

  //Ф-я теста email
  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }

  //Получаем input file в переменную
  const formImage = document.getElementById("formImage");
  // Получаем div для превью в переменную
  const formPreviev = document.getElementById("formPreviev");

  //Слушаем изменения в инпуте file
  formImage.addEventListener("change", () => {
    uploadFile(formImage.files[0]);
  });

  function uploadFile(file) {
    //проверяем тип файла
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert("Разрешены только изображения");
      formImage.value = "";
      return;
    }

    //проверим размер файла (<2 МБ)
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл должен быть менее 2 мб");
      return;
    }

    //вывод превью изображения
    var reader = new FileReader();
    reader.onload = function (e) {
      formPreviev.innerHTML = `<img src = "${e.target.result}" alt = "PHOTO">`;
    };
    reader.onerror = function (e) {
      alert("Ошибка");
    };
    reader.readAsDataURL(file);
  }
});
