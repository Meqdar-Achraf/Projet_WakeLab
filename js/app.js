// import axios from 'axios';

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
  const response = api.get("/activites")
  .then((response) => {
    if (response.status != 200) reject(new Error(`Error HTTP: status: ${response.status} \nInfo: ${response.statusText}`));
    return response.data;})
  .then(data => console.log(data))
  .catch(error => console.log(error))
};
getData()

// function Login()

// const cardContainer = document.getElementById('cards-container')
// function displayActivity(data) {
//     data.forEach(activity => {
//         const card = document.createElement('div')
//         card.classList.add("activity-card", "card", "pt-3", "my-4")
//     });
// }