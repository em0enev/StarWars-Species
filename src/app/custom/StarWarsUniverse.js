import EventEmitter from 'eventemitter3';
import Species from './Species';

export default class StarWarsUniverse extends EventEmitter {
    constructor(maxSpecies = StarWarsUniverse.consts.maxSpeciesCount) {
        super();
        this.species = [];
        this._maxSpecies = maxSpecies;
        this.init();
    }

    static get events() {
        return {
            MAX_SPECIES_REACHED: 'max_species_reached',
            SPECIES_CREATED: 'species_created'
        }
    }

    static get consts() {
        return {
            maxSpeciesCount: 10,
            speciesURL: 'https://swapi.dev/api/species/',
            firstSpecies: 1
        }
    }

    get speciesCount() {
        return this.species.length;
    }

    async init() {
        this.createSpecies();
    }

    async createSpecies() {
        let speciesIndex = StarWarsUniverse.consts.firstSpecies;
        let isMaxSpeciesReached = false;

        while (isMaxSpeciesReached === false) {
            const species = new Species();
            species.on(StarWarsUniverse.events.SPECIES_CREATED, () => this._onSpeciesCreated(species))

            this.on(StarWarsUniverse.events.SPECIES_CREATED, (dataFromOnSpeciesCreated) => this._checkForMaxSpecies(dataFromOnSpeciesCreated))

            this.once(StarWarsUniverse.events.MAX_SPECIES_REACHED, () => isMaxSpeciesReached = true)

            await species.init(StarWarsUniverse.consts.speciesURL + `${speciesIndex}`)
            speciesIndex++;
        }
    }

    _onSpeciesCreated(species) {
        this.species.push(species)
        this.emit(StarWarsUniverse.events.SPECIES_CREATED, { speciesCount: this.speciesCount })
    }

    _checkForMaxSpecies(data) {
        if (data.speciesCount === this._maxSpecies) {
            this.emit(StarWarsUniverse.events.MAX_SPECIES_REACHED)
        }
    }
}
