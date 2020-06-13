import * as Constants from './Constants.js';

export default class Weapon {
	constructor(name = 'short bow', nickname = 'sBow', attack_mod = 0, 
				damage_dice = [6], damage_mod = 0, stat = 'dex', 
				proficiency_requirements = [], is_saving_throw = false,
				should_override_stats = false, max_ammunition = Number.MAX_SAFE_INTEGER, current_ammunition = 0) {
		this.name = name;
		this.nickname = nickname;
		this.attack_mod = attack_mod;
		this.damage_dice = damage_dice;
		this.damage_mod = damage_mod;
		this.stat = stat;
		this.proficiency_requirements = proficiency_requirements;
		this.is_saving_throw = is_saving_throw;
		this.should_override_stats = should_override_stats;
		this.max_ammunition = max_ammunition;
		this.current_ammunition = current_ammunition;
	}

	static to_json(weapon) {
		weapon.version = Constants.version;
		return JSON.serialize(weapon);
	}

	static from_json(json_string) {
		let deserialized_object = JSON.parse(json_string);
		switch(deserialized_object.version) {
			case '0.1':
				return this._create_weapon_from_object(deserialized_object);
			default:
				console.log('Could not find conversion method for version \'' + deserialized_object.version + '\' on weapon. Assuming current version.');
				return this._create_weapon_from_object(deserialized_object);
		}
		return 
	}

	static _create_weapon_from_object(object) {
		let weapon = new Weapon();
		for (key in weapon) {
			weapon[key] = object[key];
		}
		return weapon;
	}
}