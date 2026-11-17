// const { default: axios } = require("axios");

// ajouter utilisateur !!!!
const username = JSON.parse(localStorage.getItem("username"));
const usermodale = document.getElementById("userModal");
function Login() {
  // usermodale.classList.replace("d-flex", "d-none");
  if (!username) {
    usermodale.classList.replace("d-none", "d-flex");
    document.body.classList.add("overflow-hidden");
    addUser();
  }
}
Login();

function addUser() {
  const user = {};
  document.getElementById("addUser").addEventListener("click", (event) => {
    user.name = document.getElementById("username").value;
    user.password = document.getElementById("password").value;
    usermodale.classList.replace("d-flex", "d-none");
    document.body.classList.remove("overflow-hidden");
    localStorage.setItem("username", JSON.stringify(user));
  });
}

// recuperer les donnees
// let activitesList = []
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});


const getData = () => {
  return api
    .get("/activites")
    .then((response) => {
      if (response.status != 200)
        reject(
          new Error(
            `Error HTTP: status: ${response.status} \nInfo: ${response.statusText}`,
          ),
        );
      return response.data;
    })
    .then((data) => {
      console.log(data);
      displayActivity(data);
    return data
    })
    .catch((error) => console.log(error));
};

getData().then((response) => {
  deleteActivity();
});

//  afficher les cards des activites
const cardContainer = document.getElementById("cards-container");

function displayActivity(data) {
  cardContainer.replaceChildren();
  data.forEach((activity) => {
    const cardSlot = document.createElement("div");
    // cardSlot.classList.add("", "");
    const card = document.createElement("div");
    card.classList.add("activity-card", "card", "pt-3", "my-4");
    cardSlot.appendChild(card);
    card.append(
      supCardInfo(activity),
      cardDescription(activity),
      cardButtons(activity),
    );
    cardContainer.appendChild(cardSlot);
  });
}

function supCardInfo(activity) {
  const supcard = document.createElement("div");
  supcard.classList.add("d-flex", "justify-content-evenly", "pb-3");
  const theme = document.createElement("span");
  const themeIcon = document.createElement("i");
  switch (activity.theme) {
    case "apprentissage":
      theme.classList.add("chip", "theme-success");
      themeIcon.classList.add("fa-solid", "fa-graduation-cap");
      break;
    case "jeu":
      theme.classList.add("chip", "theme-primary");
      themeIcon.classList.add("fa-solid", "fa-gamepad");
      break;
    case "exrcice":
      theme.classList.add("chip", "theme-danger");
      themeIcon.classList.add("fa-solid", "fa-dumbbell");
      break;
    default:
      theme.classList.add("chip", "theme-info");
      themeIcon.classList.add("fa-brands", "fa-ethereum");
      break;
  }
  const duree = document.createElement("span");
  duree.classList.add("badge", "badge-subtle", "theme-secondary");
  const dureeIcon = document.createElement("i");
  dureeIcon.classList.add("fa-solid", "fa-clock");

  const user = document.createElement("span");
  user.classList.add("badge", "badge-subtle", "theme-inverse");
  const userIcon = document.createElement("i");
  userIcon.classList.add("fa-solid", "fa-circle-user");

  theme.append(themeIcon);
  duree.append(dureeIcon);
  user.append(userIcon);

  theme.textContent += activity.theme;
  duree.textContent += `${activity.duree} min`;
  user.textContent += activity.auteur;
  supcard.append(theme, duree, user);
  return supcard;
}

function cardDescription(activity) {
  const cardinnerinfo = document.createElement("div");
  const cardBody = document.createElement("div");
  const activityname = document.createElement("h4");
  const activitydescription = document.createElement("p");
  const activityObjectif = document.createElement("p");
  const activityObjectifIcone = document.createElement("i");

  cardinnerinfo.classList.add("px-6");
  cardBody.classList.add("card-body");
  activityname.classList.add("card-title");
  activitydescription.classList.add("card-text");
  activityObjectifIcone.classList.add("fa-solid", "fa-bullseye", "fg-warning");

  activityname.textContent = activity.titre;
  activitydescription.textContent = activity.description;
  activityObjectif.appendChild(activityObjectifIcone);
  activityObjectif.textContent = activity.objectifs;

  cardBody.append(activityname, activitydescription, activityObjectif);
  cardinnerinfo.appendChild(cardBody);
  return cardinnerinfo;
}

function cardButtons(activity) {
  const divButtons = document.createElement("div");
  const modifyButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const modifyButtonIcon = document.createElement("i");
  const deleteButtonIcon = document.createElement("i");
  const timeModifyer = document.createElement("button");

  divButtons.classList.add("py-3", "ps-5", "pb-5", "d-flex", "gap-5");
  modifyButton.classList.add("mod-btn", "btn-outline", "theme-accent");
  deleteButton.classList.add("del-btn", "btn-outline", "theme-danger");
  modifyButtonIcon.classList.add("fa-solid", "fa-pen");
  deleteButtonIcon.classList.add("fa-solid", "fa-trash");
  timeModifyer.classList.add("btn-outline", "theme-warning");

  modifyButton.setAttribute("type", "button");
  modifyButton.setAttribute("data-activity", `${activity.id}`);
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("data-activity", `${activity.id}`);

  modifyButton.appendChild(modifyButtonIcon);
  deleteButton.appendChild(deleteButtonIcon);

  modifyButton.textContent = "Modifier";
  deleteButton.textContent = "Supprimer";
  timeModifyer.textContent = "Modifier la durée";

  divButtons.append(modifyButton, timeModifyer, deleteButton);
  return divButtons;
}

// ajouter activites
const form = document.getElementById("addActivity");
console.log(form);
const activity = {};
console.log(username);
document.getElementById("creatActivity").addEventListener("click", (event) => {
  ajouterActivite();
  form.reset()
});
async function ajouterActivite() {
  activity.titre = document.getElementById("activity-Name").value;
  activity.theme = document.getElementById("select-theme").value;
  activity.duree = Number(document.getElementById("activity-duree").value);
  activity.objectifs = document.getElementById("activity-objectifs").value;
  activity.description = document.getElementById("activity-Description").value;
  activity.auteur = username.name;
  activity.createdAt = new Date().toISOString();
  console.log(activity);
  try {
    const response = await api.post("/activites", activity);
    getData();
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
  }
}

// supprimer une card
function deleteActivity() {
  const deleteButtons = document.querySelectorAll(".del-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      console.log(event.target.dataset.activity);
      confirmation(event);
      
    });
  });
}
const log = document.querySelector("#log");
function confirmation(eventtarget) {
  if (window.confirm("vous confirmez la suppression de cette activities ?")) {
    try {
      api.delete(`/activites/${eventtarget.target.dataset.activity}`).then(res => {
        getData()
        window.location.reload();
        containerVide()

      })
    } catch (error) {
      console.log(error);
    }
  }
}
