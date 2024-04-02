document.addEventListener('DOMContentLoaded', function () {
  var etudiant2 = document.getElementById('etu2')

  // Écouter les changements de l'état du switch
  var binomeSwitch = document.getElementById('binomeSwitch')
  binomeSwitch.addEventListener('change', function () {
    if (binomeSwitch.checked) {
      // Si le switch est activé, cacher la deuxième liste déroulante et réinitialiser sa valeur
      etudiant2.style.display = 'none'
      etudiant2.value = ''
    } else {
      // Si le switch est désactivé, afficher la deuxième liste déroulante
      etudiant2.style.display = 'block'
    }
  })
})
