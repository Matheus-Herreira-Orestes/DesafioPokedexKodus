const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");


const limit = 151;
let offset = 0;
let pokemons = [];
let firstPokemon = null;
let secondPokemon = null;

//converte pokemon em html
function PokeConvert(pokemon) {
    return `
    <li class="pokemon ${pokemon.type}" onclick="showPopup(${pokemon.number})">
        <span class="number">${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail" >
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <div class="listStats">
                <span>Ataque: ${pokemon.attack}</span>
                <span>Defesa: ${pokemon.defense}</span>
            </div>
        </div>
        
    </li>

    <div class="containerSelectCompare">
        <button class="selectCompare" onclick="openComparePopup(${pokemon.number})">Comparar</button>
    </div>
    `;
}

// Função para abrir o pop-up e exibir as informações do Pokemon
function showPopup(pokemonNumber) {
    const pokemon = pokemons.find(p => p.number === pokemonNumber);
    if (!pokemon) {
        console.error(`Pokemon com número ${pokemonNumber} não encontrado.`);
        return;
    }

    const types = pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join(' ');

    const somaAtributos = pokemon.attack + pokemon.hp + pokemon.defense + pokemon.special_attack + pokemon.special_defense + pokemon.speed;
    const popupDetails = document.getElementById('popupDetails');
    popupDetails.innerHTML = `
      <h2 style="text-transform: capitalize;">${pokemon.name}</h2>
      <p>Hp: ${pokemon.hp}</p>
      <p>Ataque: ${pokemon.attack}</p>
      <p>Defesa: ${pokemon.defense}</p>
      <p>Ataque especial: ${pokemon.special_attack}</p>
      <p>Defesa especial: ${pokemon.special_defense}</p>
      <p>Velocidade: ${pokemon.speed}</p>
      <p>Soma dos atributos base: ${somaAtributos}</p>
      <p>Tipo(s): ${types}</p>
      <img src="${pokemon.photo}" alt="${pokemon.name}">
    `;
    document.getElementById('pokemonPopup').style.display = 'block';
} //fim show Popup

// Função para fechar o pop-up
function closePopup() {
    document.getElementById('pokemonPopup').style.display = 'none';
} //fim closePopup

// Função para abrir o pop-up de comparação
function openComparePopup(pokemonNumber) {
    firstPokemon = pokemons.find(p => p.number === pokemonNumber);
    if (!firstPokemon) {
        console.error(`Pokemon com número ${pokemonNumber} não encontrado.`);
        return;
    }
    
    document.getElementById('firstPokemonImage').src = firstPokemon.photo;

    const secondPokemonSelect = document.getElementById('secondPokemonSelect');
    secondPokemonSelect.innerHTML = '<option value="">Selecione o segundo Pokemon</option>';
    pokemons.forEach(pokemon => {
        if (pokemon.number !== firstPokemon.number) {
            secondPokemonSelect.innerHTML += `<option value="${pokemon.number}">${pokemon.name}</option>`;
        }
    });

    document.getElementById('popupCompare').style.display = 'block';
} //fim openComparePopup

// Função para fechar o pop-up de comparação
function closeComparePopup() {
    document.getElementById('popupCompare').style.display = 'none';
    document.getElementById('secondPokemonImage').src = '';
    firstPokemon = null;
    secondPokemon = null;
} //fim da closeComparePopup


// Função para selecionar o segundo Pokemon para a comparação
function selectSecondPokemon() {
    const selectedNumber = parseInt(document.getElementById('secondPokemonSelect').value);
    secondPokemon = pokemons.find(p => p.number === selectedNumber);
    if (secondPokemon) {
        document.getElementById('secondPokemonImage').src = secondPokemon.photo;
    } else {
        document.getElementById('secondPokemonImage').src = '';
    }
}//fim da selectSecondPokemon


// Função para comparar os Pokemon selecionados, comparando a soma dos Atributos base (ataque, defesa, defesa especial, ataque especial e a velocidade do pokemon)
function compareSelectedPokemons() {
    if (!firstPokemon || !secondPokemon) {
        alert('Por favor, selecione dois Pokemon para comparar.');
        return;
    }

    const somaAtributosFirst = firstPokemon.attack + firstPokemon.hp + firstPokemon.defense + firstPokemon.special_attack + firstPokemon.special_defense + firstPokemon.speed;
    const somaAtributosSecond = secondPokemon.attack + secondPokemon.hp + secondPokemon.defense + secondPokemon.special_attack + secondPokemon.special_defense + secondPokemon.speed;

    let resultado = '';
    if (somaAtributosFirst > somaAtributosSecond) {
        resultado = `${firstPokemon.name} é mais forte que ${secondPokemon.name} com ${somaAtributosFirst} pontos contra ${somaAtributosSecond}.`;
    } else if (somaAtributosFirst < somaAtributosSecond) {
        resultado = `${secondPokemon.name} é mais forte que ${firstPokemon.name} com ${somaAtributosSecond} pontos contra ${somaAtributosFirst}.`;
    } else {
        resultado = `${firstPokemon.name} e ${secondPokemon.name} são igualmente fortes com ${somaAtributosFirst} pontos cada.`;
    }

    alert(resultado);
} // fim da compareSelectedPokemons

// Função para carregar os Pokemon na lista
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemonsData = []) => {
        pokemons = pokemonsData; 
        displayPokemons(pokemons);
    });
} // Fim da loadPokemonItens

// Função para exibir os Pokemon na lista
function displayPokemons(pokemonsToDisplay) {
    const newHtml = pokemonsToDisplay.map(PokeConvert).join('');
    pokemonList.innerHTML = newHtml;
} //Fim da displayPokemons

// Carrega os Pokemon na lista ao carregar a página
loadPokemonItens(offset, limit);


// Event listener para filtrar os Pokemon conforme o usuário digita na barra de pesquisa
searchInput.addEventListener('input', function() {
    const searchText = searchInput.value.toLowerCase();
    const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchText));
    displayPokemons(filteredPokemons);
}); // fim do EventListener
