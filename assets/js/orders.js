let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

document.addEventListener("DOMContentLoaded", async () => {
  axios.defaults.baseURL = "http://localhost:3000";

  let tbody = document.querySelector("tbody");
  let createUserModal = document.querySelector("#create-user-modal");
  let editUserModal = document.querySelector("#edit-user-modal");

  let createUserModalInstance = null;
  createUserModal.addEventListener("shown.bs.modal", function () {
    createUserModalInstance = bootstrap.Modal.getInstance(createUserModal);
  });

  let editUserModalInstance = null;
  editUserModal.addEventListener("shown.bs.modal", function () {
    editUserModalInstance = bootstrap.Modal.getInstance(editUserModal);
  });

  const updateUser = (user) => {
    let tr = document.querySelector(`#user-${user.id}`);

    let tds = [
      user.date,
      user.clientName,
      user.totalPrice,
      user.status,
    ];

    tds.forEach((td, index) => {
      tr.children[index].innerHTML = td;
    });
  };

  const appendUser = (user) => {
    let tr = document.createElement("tr");
    tr.id = `user-${user.id}`;

    let tds = [
      user.date,
      user.clientName,
      user.totalPrice,
      user.status,
    ];

    tds.forEach((td) => {
      let tdElement = document.createElement("td");
      tdElement.classList.add("align-middle");
      tdElement.innerHTML = td;
      tr.append(tdElement);
    });

    let actionsTd = document.createElement("td");
    let changePasswordBtn = document.createElement("button");
    let editBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");
    actionsTd.classList.add("align-middle");
    changePasswordBtn.innerHTML =
      '<span class="material-icons-outlined fs-5"> key </span>';
    changePasswordBtn.classList.add("btn", "btn-warning", "btn-sm");
    editBtn.classList.add("btn", "btn-success", "btn-sm");
    editBtn.innerHTML =
      '<span class="material-icons-outlined fs-5"> edit </span>';
    deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
    deleteBtn.innerHTML =
      '<span class="material-icons-outlined fs-5"> delete </span>';

    actionsTd.append(changePasswordBtn, editBtn, deleteBtn);

    tr.append(actionsTd);

    tbody.append(tr);

    deleteBtn.addEventListener("click", async () => {
      tr.remove();

      await axios.delete(`/orders/${user.id}`);
    });

    editBtn.addEventListener("click", () => {
      let form = document.querySelector("#edit-user-form");
      new bootstrap.Modal("#edit-user-modal").show();

      form.querySelector("#edit-first-name").value = user.first_name;
      form.querySelector("#edit-last-name").value = user.last_name;
      form.querySelector("#edit-age").value = user.age;
      form.querySelector("#edit-email").value = user.email;
      form.querySelector("#edit-image").value = user.image;

      document
        .querySelector("#edit-user-btn")
        .addEventListener("click", async () => {
          let first_name = form[0].value;
          let last_name = form[1].value;
          let age = +form[2].value;
          let email = form[3].value;
          let image = form[4].value;

          let newUserInfo = {
            first_name,
            last_name,
            age,
            email,
            password: user.password,
            image,
          };

          let { data } = await axios.put(`/orders/${user.id}`, newUserInfo);

          updateUser(data);

          editUserModalInstance.hide();
        });
    });
  };

  let users = await axios.get("/orders");

  users.data.forEach(appendUser);

  let createUserBtn = document.querySelector("#create-user-btn");

  async function createUser() {
    let form = document.querySelector("#create-user-form");

    let first_name = form[0].value;
    let last_name = form[1].value;
    let age = +form[2].value;
    let email = form[3].value;
    let password = form[4].value;
    let image = form[5].value;

    let newUser = {
      first_name,
      last_name,
      age,
      email,
      password,
      image,
    };
    let res = await axios.post("/orders", newUser);

    form.reset();

    createUserModalInstance.hide();

    appendUser(res.data);
  }

  createUserBtn.addEventListener("click", createUser);
});