// const { Activity } = require("react");

// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   headers: { "Content-Type": "application/json" },
// });

// const chargerActivites = async () => {
//   try {
//     const response = await api.get("/activites");
//     return response.data;
//   } catch (error) {
//     console.error(error.response?.data?.message ?? "API inaccessible");
//     return [];
//   }
// };

const getData = () => {
  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" },
  });
  //   console.log(api.get("/activites"))
  const response = api
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
      console.log(data)
      displayActivity(data)})
    .catch((error) => console.log(error));
};
getData();

// function Login()

const cardContainer = document.getElementById("cards-container");
function displayActivity(data) {
  data.forEach((activity) => {
    const cardSlot = document.createElement("div");
    cardSlot.classList.add("col-md-3", "col-4");
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
    case 'exrcice':
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

  divButtons.classList.add("py-3", "ps-12", "pb-5", "d-flex", "gap-6");
  modifyButton.classList.add("btn-outline", "theme-accent");
  deleteButton.classList.add("btn-outline", "theme-danger");
  modifyButtonIcon.classList.add("fa-solid", "fa-pen");
  deleteButtonIcon.classList.add("fa-solid", "fa-trash");

  modifyButton.setAttribute("type", "button");
  modifyButton.setAttribute("data-activity", `${activity.id}`);
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("data-activity", `${activity.id}`);

  modifyButton.appendChild(modifyButtonIcon);
  deleteButton.appendChild(deleteButtonIcon);

  modifyButton.textContent = "Modifier";
  deleteButton.textContent = "Supprimer";

  divButtons.append(modifyButton, deleteButton);
  return divButtons;
}

