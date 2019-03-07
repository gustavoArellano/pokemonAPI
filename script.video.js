$('form').on('submit', function(e) {
    e.preventDefault();

    var types = $('input[type=text]').val().replace(' ', '');
    types = types.split(',');
    var trainerTypes = types.map(function(type) {
        return $.ajax({
            url: 'http://pokeapi.co/api/v2/type/' + type,
            dataType: 'json',
            method: 'GET'
        });
    });

    $.when.apply(null, trainerTypes)
        .then(function() {
            var pokemonTypes = Array.prototype.slice.call(arguments);
            getDoubleDmgTypes(pokemonTypes);
        });
});

function getDoubleDmgTypes(pokemonTypes) {
    pokemonTypes = pokemonTypes.map(function(types) {
        console.log(pokemonTypes)
        return pokemonTypes[0].damage_relations.double_damage_from;
    });
    pokemonTypes = flatten(pokemonTypes);

    var damageTypes = pokemonTypes.map(function(type) {
        return $.ajax({ 
            url: type.url,
            dataType: 'json',
            method: 'GET'
        });
    });

    $.when.apply(null, damageTypes)
    .then(function() {
        var pokemon = Array.prototype.slice.call(arguments);
        buildTeam(pokemon);
    });
}

function buildTeam(pokemon) {
    pokemon = pokemon.map(function(poke) {
        return poke[0].pokemon;
    });

    pokemon = flatten(pokemon);
    var team = [];

    for(var i = 0; i < 6; i++) {
        team.push( getRandomPokemon(pokemon) );
    }

    team = team.map(function(pokemon) {
        return $.ajax({
            url: pokemon.pokemon.url,
            dataType: 'json',
            method: 'GET'
        });
    });

    $.when.apply(null, team)
        .then(function() {
            var pokemonTeam = Array.prototype.slice.call(arguments);
            pokemonTeam = pokemonTeam.map(function(poke) {
                return poke[0];
            });
            displayPokemon(pokemonTeam);
        });
}

function displayPokemon(pokemon) {
    pokemon.forEach(function(poke) {
        $.getJSON(function(data){
            var pokeID = data.national_id;
            var pokeName = data.name;
            var pokeType1 = data.types[0].name;
            if (data.types.length == 2) {
                var pokeType2 = data.types[1].name;
            }
            else var pokeType2 = null;
            var $container = $('<div>').addClass('pokemon');
            var $image = $('<img>').attr('src', "http://pokeapi.co" + data.descriptions[0].resource_uri);
            var $title = $('<h2>').text(poke.name);
            $container.append($image, $title);
            $('.poke-container').append($container);
        });
    });
}

function getRandomPokemon(pokemonArray) {
    var index = Math.floor(Math.random() * pokemonArray.length)
    return pokemonArray[index];
}

function flatten(arrayToFlatten) {
    return arrayToFlatten.reduce(function(a, b) {
        return a.concat(b);
    }, []);
}