document.addEventListener('DOMContentLoaded', () => {
  const addDessertButtons = document.querySelectorAll('.add-dessert');
  const cartDetails = document.querySelector('.liste-add-details');
  const emptyCartMessage = document.querySelector('.empty');
  const totalPriceValue = document.getElementById('total-pricce-value');
  const quantityValue = document.getElementById('quantity');
  const cartItemList = document.createElement('div');

  // Initialisation de la structure du panier
  cartDetails.insertBefore(cartItemList, cartDetails.querySelector('.order-total'));

  let totalPrice = 0;
  let itemCount = 0;

  addDessertButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          const dessertCard = event.currentTarget.closest('.dessert-card');
          const title = dessertCard.querySelector('h2').textContent;
          const price = parseFloat(dessertCard.querySelector('.dessert-prix').textContent.substring(1)); // Remove '$'
          const compteur = dessertCard.querySelector('.compteur');
          const quantitySpan = compteur.querySelector('span');

          // Changer la visibilité de "Add to cart" et le compteur
          event.currentTarget.style.display = 'none'; 
          compteur.style.display = 'flex'; 

          // Incrémente la quantité
          let currentQuantity = parseInt(quantitySpan.textContent, 10);
          currentQuantity++;
          quantitySpan.textContent = currentQuantity;

          // Ajout de l'article au panier
          addCartItem(title, price, currentQuantity);
      });
  });

  function addCartItem(title, price, quantity) {
      const existingItem = Array.from(cartItemList.children).find(item => item.dataset.title === title);
      
      if (existingItem) {
          const existingQuantitySpan = existingItem.querySelector('.quantity');
          const previousQuantity = parseInt(existingQuantitySpan.textContent, 10);
          const newQuantity = previousQuantity + quantity;
          existingQuantitySpan.textContent = newQuantity;

          totalPrice += price * quantity; // Met à jour le total en ajoutant le nouveau prix
      } else {
          const itemElement = document.createElement('div');
          itemElement.className = 'cart-item';
          itemElement.dataset.title = title;

          itemElement.innerHTML = `
              <p>${title} - $${price.toFixed(2)} x <span class="quantity">1</span></p>
              <button class="remove-item" style="border: none; background: none; cursor:pointer;">
                &#10006; <!-- Ceci est un X -->
              </button>
          `;
          
          cartItemList.appendChild(itemElement);

          // Écouteur d'événement pour supprimer l'article
          itemElement.querySelector('.remove-item').addEventListener('click', () => {
            const itemQuantity = parseInt(itemElement.querySelector('.quantity').textContent, 10);
            totalPrice -= price * itemQuantity;
            totalPriceValue.textContent = totalPrice.toFixed(2);
            itemCount -= itemQuantity;
            quantityValue.textContent = itemCount;

            // Remettre à zéro le compteur dans la carte de dessert
            const dessertCard = Array.from(document.querySelectorAll('.dessert-card')).find(card => {
                return card.querySelector('.dessert-info h2').textContent === title;
            });

            if (dessertCard) {
                const compteur = dessertCard.querySelector('.compteur');
                const quantitySpan = compteur.querySelector('span');
                quantitySpan.textContent = '0';
                compteur.style.display = 'none'; // Cache le compteur
                const addDessert = dessertCard.querySelector('.add-dessert');
                addDessert.style.display = 'flex'; // Affiche le bouton "Add to cart"
            }

            cartItemList.removeChild(itemElement);
            updateCartDisplay();
        });


                totalPrice += price; // Ajout du prix du nouvel élément
            }

            itemCount += quantity; // Met à jour l'itemCount total
            totalPriceValue.textContent = totalPrice.toFixed(2);
            quantityValue.textContent = itemCount;

            updateCartDisplay();
  }

  function updateCartDisplay() {
      if (itemCount > 0) {
          emptyCartMessage.style.display = 'none';
          cartDetails.style.display = 'block';
      } else {
          emptyCartMessage.style.display = 'flex';
          cartDetails.style.display = 'none';
      }
  }

  // Événements pour les boutons + et -
  const incrementButtons = document.querySelectorAll('.increment');
  const decrementButtons = document.querySelectorAll('.decrement');

  incrementButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          const compteur = event.currentTarget.parentElement;
          const quantitySpan = compteur.querySelector('span');
          let currentQuantity = parseInt(quantitySpan.textContent, 10);
          currentQuantity++;
          quantitySpan.textContent = currentQuantity;

          const dessertCard = event.currentTarget.closest('.dessert-card');
          const title = dessertCard.querySelector('h2').textContent;
          const price = parseFloat(dessertCard.querySelector('.dessert-prix').textContent.substring(1));

          // Appelez addCartItem avec la nouvelle quantité
          addCartItem(title, price, 1); // Ajoute 1 au panier
      });
  });

  decrementButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          const compteur = event.currentTarget.parentElement;
          const quantitySpan = compteur.querySelector('span');
          let currentQuantity = parseInt(quantitySpan.textContent, 10);

          // Décrémenter la quantité
          if (currentQuantity > 0) {
              // Mettre à jour l'élément dans le panier
              const dessertCard = event.currentTarget.closest('.dessert-card');
              const title = dessertCard.querySelector('h2').textContent;
              const price = parseFloat(dessertCard.querySelector('.dessert-prix').textContent.substring(1));
              const existingItem = Array.from(cartItemList.children).find(item => item.dataset.title === title);

              // Décrémenter la quantité seulement si > 0
              currentQuantity--;
              quantitySpan.textContent = currentQuantity;

              if (existingItem) {
                  const existingQuantitySpan = existingItem.querySelector('.quantity');
                  const previousQuantity = parseInt(existingQuantitySpan.textContent, 10);
                  const newQuantity = previousQuantity - 1;
                  existingQuantitySpan.textContent = newQuantity;

                  totalPrice -= price; // Met à jour le prix total
                  totalPriceValue.textContent = totalPrice.toFixed(2);
                  itemCount--; // Décrémenter le nombre total d'items
                  quantityValue.textContent = itemCount;

                  // Si quantité = 0, supprimer l'article du panier
                  if (newQuantity <= 0) {
                      cartItemList.removeChild(existingItem);
                  }
              }

              // Gérer l'affichage des éléments et le bouton Ajouter au panier
              if (currentQuantity === 0) {
                  const addDessert = compteur.closest('.dessert-img').querySelector('.add-dessert');
                  addDessert.style.display = 'flex';
                  compteur.style.display = 'none';
              }

              updateCartDisplay();
          }
      });
  });

  document.getElementById('confirm-order').addEventListener('click', () => {
        const modal = document.querySelector('.modal');
        const modalCartItems = modal.querySelector('.modal-cart-items');
        const modalTotalPriceValue = modal.querySelector('#modal-total-price-value');
        
        // Vider le contenu précédent dans la modale
        modalCartItems.innerHTML = '';
        
        // Remplir le conteneur avec les articles du panier
        Array.from(cartItemList.children).forEach(item => {
            const title = item.dataset.title;
            const quantity = item.querySelector('.quantity').textContent;
            const price = parseFloat(item.textContent.split('- $')[1].split(' x')[0]);
    
            const cartItemElement = document.createElement('div');
            cartItemElement.textContent = `${title} - $${price.toFixed(2)} x ${quantity}`;
            modalCartItems.appendChild(cartItemElement);
        });
    
        // Mettre à jour le total dans la modale
        modalTotalPriceValue.textContent = totalPrice.toFixed(2);
    
        // Affiche la modale
        modal.style.display = 'block';
    
        // Affichage du fond flou
        document.body.classList.add('show-before');
        document.body.style.overflow = 'hidden'; // Empêche le défilement de la page en arrière-plan
    
        // Événement de fermeture de la modale
        modal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('show-before');  
            document.body.style.overflow = ''; 
        });
    });

  document.getElementById('start-new-order').addEventListener('click', () => {
    // Fermer la modal
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';

    // Réinitialiser les quantités des desserts
    const dessertCards = document.querySelectorAll('.dessert-card');
    dessertCards.forEach(card => {
        const quantitySpan = card.querySelector('.compteur span');
        quantitySpan.textContent = '0'; 
        const compteur = card.querySelector('.compteur');
        compteur.style.display = 'none'; 
        const addDessert = card.querySelector('.add-dessert');
        addDessert.style.display = 'flex';
    });

    // Réinitialiser la quantité totale
    document.getElementById('quantity').textContent = '0';
    
    // Réinitialiser le prix total
    document.getElementById('total-pricce-value').textContent = '0';

    // Vider le panier
    cartItemList.innerHTML = '';
    totalPrice = 0;
    itemCount = 0;
    updateCartDisplay(); // Mettre à jour l'affichage du panier pour refléter qu'il est vide
  });
});
