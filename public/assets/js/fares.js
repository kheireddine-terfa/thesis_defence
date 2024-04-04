document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour afficher une annonce
  
function afficherAnnonce(titre, date, contenu) {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const pDate = document.createElement('p');
    const pContenu = document.createElement('p');
  
    h3.textContent = titre;
    pDate.textContent = date;
    pContenu.textContent = contenu;
  
    li.appendChild(h3);
    li.appendChild(pDate);
    li.appendChild(pContenu);
  
    document.querySelector('#ul-ann').appendChild(li);
  }
  
  // Remplacer les exemples ci-dessous par des données réelles
  const annonces = [
    {
      titre: "Annonce 1",
      date: "2023-11-14",
      contenu: "Ceci est le contenu de l'annonce 1."
    },
    {
      titre: "Annonce 2",
      date: "2023-11-15",
      contenu: "Ceci est le contenu de l'annonce 2."
    }
    ,
    {
      titre: "Annonce 3",
      date: "2023-11-16",
      contenu: "Ceci est le contenu de l'annonce 3."
    },
    {
      titre: "Annonce 4",
      date: "2023-12-17",
      contenu: "Ceci est le contenu de l'annonce 4."
    }

  ];
  
  // Boucler sur les annonces et les afficher
  annonces.forEach(annonce => {
    afficherAnnonce(annonce.titre, annonce.date, annonce.contenu);
  });
});
// Foction pour acceder aux annonces
  const labelAnnonces = document.querySelector('label[id="label_header"]');

labelAnnonces.addEventListener('click', () => {
  window.location.href = "../views/annonces.html";
});