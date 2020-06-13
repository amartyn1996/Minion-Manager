import * as Constants from './Constants.js';
import Minion from './Minion.js';

export default class DNDBasicState {
	constructor() {
		this.minions = this._create_default_minions(Constants.default_number_of_central_columns);
		this.total_damage = 0;
	}

	_create_default_minions(number_of_minions) {
		let minions = [];
		for (let i=0; i<number_of_minions; i++) {
			minions.push( new Minion() );
		}
		return minions;
	}
}