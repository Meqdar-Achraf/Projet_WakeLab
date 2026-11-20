const regexusername = /^[A-Za-z]+(?: [A-Za-z'-]+)+$/;
const regexTitre = /^.{5,100}$/;
const regexDescription = /^.{20,1000}$/;

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
    if (!regexusername.test(user.name)) {
      Swal.fire({
        title: "Error",
        text: "Le nom complet doit contenir au moins deux parties",
        icon: "warning",
      });
    } else {
      usermodale.classList.replace("d-flex", "d-none");
      document.body.classList.remove("overflow-hidden");
      localStorage.setItem("username", JSON.stringify(user));
    }
  });
}

// recuperer les donnees======================================================================================
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
      deleteActivity();
      clickmodifier(data);
      RecherchActivite(data);
      clickmodifyTime(data)
      return data;
    })
    .catch((error) => console.log(error));
};
getData();

//  afficher les cards des activites======================================================================================
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
  timeModifyer.classList.add("time-btn", "btn-outline", "theme-warning");

  modifyButton.setAttribute("type", "button");
  modifyButton.setAttribute("data-activity", `${activity.id}`);
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("data-activity", `${activity.id}`);
  timeModifyer.setAttribute("type", "button");
  timeModifyer.setAttribute("data-activity", `${activity.id}`);

  modifyButton.appendChild(modifyButtonIcon);
  deleteButton.appendChild(deleteButtonIcon);

  modifyButton.textContent = "Modifier";
  deleteButton.textContent = "Supprimer";
  timeModifyer.textContent = "Modifier la durée";

  divButtons.append(modifyButton, timeModifyer, deleteButton);
  return divButtons;
}

// ajouter activites======================================================================================
const form = document.getElementById("addActivity");
const activity = {};
document.getElementById("creatActivity").addEventListener("click", (event) => {
  ajouterActivite();
  form.reset();
});

function activitesValues(activity) {
  activity.titre = document.getElementById("activity-Name").value;
  activity.theme = document.getElementById("select-theme").value;
  activity.duree = Number(document.getElementById("activity-duree").value);
  activity.objectifs = document.getElementById("activity-objectifs").value;
  activity.description = document.getElementById("activity-Description").value;
  activity.auteur = username.name;
  // activity.createdAt = new Date().toISOString();
  return activity;
}

async function ajouterActivite() {
  try {
    // if (InputsValidation(activity)) {
      const response = await api.post("/activites", activitesValues(activity));
      getData();
      Swal.fire({
        title: "Success",
        text: "activité été crée avec success!!",
        icon: "success",
        theme: "dark",
      });
    // }
  } catch (error) {
    console.error("Erreur :", error.response?.data || error.message);
    Swal.fire({
      title: "error",
      text: "Operation annulée",
      icon: "success",
      theme: "dark",
    });
  }
}

// supprimer une card======================================================================================
function deleteActivity() {
  const deleteButtons = document.querySelectorAll(".del-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      confirmation(event);
    });
  });
}

const log = document.querySelector("#log");
function confirmation(eventtarget) {
  if (window.confirm("vous confirmez la suppression de cette activities ?")) {
    try {
      api
        .delete(`/activites/${eventtarget.target.dataset.activity}`)
        .then((res) => {
          Swal.fire({
            title: "success",
            text: "activité été supprimmé avec success!!",
            icon: "success",
            theme: "dark",
          });
          getData();
        });
    } catch (error) {
      console.log(error);
    }
  }
}

// modification des activités======================================================================================
let modifyToActivity;
let buttonOfModifcation;

function clickmodifier(activities) {
  const modifybuttons = document.querySelectorAll(".mod-btn");
  modifybuttons.forEach((button) => {
    buttonOfModifcation = button
    buttonOfModifcation.isSelected = false
    button.addEventListener("click", (event) => {
      form.scrollIntoView({ behavior: "smooth" });
      buttonOfModifcation = event.target;  
      changeButtonselectedstatus(buttonOfModifcation, true)
      console.log(buttonOfModifcation.isSelected)
      modifyToActivity = activities.find((activity) => activity.id == buttonOfModifcation.dataset.activity);
      modifyinputvalue(modifyToActivity);
      changeFormulaire(
        "form-titleAdd",
        "creatActivity",
        "form-titleMod",
        "ModifyButtonContainer",
      );
      skipModification(buttonOfModifcation)
    });
  });
}


function modifyinputvalue(activityTomodify) {
  document.getElementById("activity-Name").value = activityTomodify.titre;
  document.getElementById("select-theme").value = activityTomodify.theme;
  document.getElementById("activity-duree").value = activityTomodify.duree;
  document.getElementById("activity-objectifs").value =
    activityTomodify.objectifs;
  document.getElementById("activity-Description").value =
    activityTomodify.description;
}

async function modifyActivities(acticitytomodify, id) {
  activitesValues(acticitytomodify);
  await api.put(`/activites/${id}`, acticitytomodify);
  Swal.fire({
    title: "success",
    text: "activité été modifié avec success!!",
    icon: "success",
    theme: "dark",
  });
  getData();
}
// ========================================================================================

// search function======================================================================================
function RecherchActivite(activities) {
  const searchInputValue = document.getElementById("search");
  document.getElementById("searchbutton").addEventListener("click", () => {
    const searchresult = activities.filter((activity) =>
      activity.titre
        .toLowerCase()
        .includes(searchInputValue.value.toLowerCase()),
    );
  });
}

// modifier la duree======================================================================================

let timeModificationButton
let timeModificationActicity
function clickmodifyTime(activities){
  const timeButtons= document.querySelectorAll('.time-btn')
  timeButtons.forEach(button =>{
    timeModificationButton = button
    timeModificationButton.isSelected = false
    button.addEventListener('click', event =>{
      const dureToModify = activities.find(activity => activity.id == event.target.dataset.activity);
      console.log(dureToModify)
      inputdisabled(form, true)
      modifyinputvalue(dureToModify)
      changeFormulaire("form-titleAdd","creatActivity","form-titleMod","ModifyButtonContainer");
      timeModificationActicity = dureToModify
      timeModificationButton = event.target
      changeButtonselectedstatus(timeModificationButton, true)
      skipModification(timeModificationButton)
    })
  })
}

function inputdisabled(formulaire, status){
    const formulaireInputs = formulaire.querySelectorAll('.form-input')
    formulaireInputs.forEach(input => {
      input.disabled = status      
    });
}

async function modifierDuree(){
  await api.patch(`/activites/${timeModificationActicity.id}`, {duree: Number(document.getElementById('activity-duree').value)})
  console.log(timeModificationActicity.id)
  console.log(document.getElementById('activity-duree').value)
  // timeModificationActicity.duree = Number(document.getElementById('activity-duree').value)
  console.log(timeModificationActicity)
  inputdisabled(form, false)
  changeButtonselectedstatus(timeModificationButton, false)
  getData();

}

// Annuler Modification & commun functions ===========================================================

function skipModification(button){
  document.getElementById("annulerModification").addEventListener("click", () => {
  changeFormulaire(
    "form-titleMod",
    "ModifyButtonContainer",
    "form-titleAdd",
    "creatActivity",
  );
  form.reset();
  changeButtonselectedstatus(button, false)
  inputdisabled(form, false)
});
}
function changeButtonselectedstatus(button, status){button.isSelected = status}


document.getElementById("modifyActivity").addEventListener("click", () => {
  if(buttonOfModifcation.isSelected){
    modifyActivities(modifyToActivity, buttonOfModifcation.dataset.activity);  
    changeButtonselectedstatus(buttonOfModifcation, false)
  }
  console.log(timeModificationButton)
  if(timeModificationButton.isSelected){
    modifierDuree()
  }
  changeFormulaire(
    "form-titleMod",
    "ModifyButtonContainer",
    "form-titleAdd",
    "creatActivity",
  );
  inputdisabled(form, false)
  form.reset();
});

function changeFormulaire(item1dNone, item2dNone, item1, item2) {
  document.getElementById(item1dNone).classList.add("d-none");
  document.getElementById(item1).classList.remove("d-none");
  document.getElementById(item2dNone).classList.add("d-none");
  document.getElementById(item2).classList.remove("d-none");
}



















