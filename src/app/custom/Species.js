import EventEmitter from "eventemitter3";

export default class Species extends EventEmitter{
    constructor() {
        super();
        this.name = null;
        this.classification = null;
    };

    static get events(){
        return {
            SPECIES_CREATED: 'species_created'
        }
    }

    async init(url){
        const response = await fetch(url);
        const data = await response.json();
        
        this.name =data.name;
        this.classification= data.classification;
        this.emit(Species.events.SPECIES_CREATED)
    }
}