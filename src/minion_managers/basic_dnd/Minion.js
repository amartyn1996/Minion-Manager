import * as Constants from './Constants.js';
import Weapon from './Weapon.js';

export default class Minion {
	constructor() {
		this.name = 'Skeleton';
		this.nickname = 'sktn';
		this.hit_points = 13;
		this.max_hit_points = 13;
		this.armor_class = 13;

		this.proficiency_mod = 2; //modifier is half the challenge rating
		this.str_mod = 0;
		this.dex_mod = 2;
		this.con_mod = 2;
		this.int_mod = -2;
		this.wis_mod = -1;
		this.cha_mod = -3;
		this.checks = {
	        'Strength Save': {has_proficiency: false, should_override: false, override_value: 0},
	        'Dexterity Save': {has_proficiency: false, should_override: false, override_value: 0},
	        'Constitution Save': {has_proficiency: false, should_override: false, override_value: 0},
	        'Intelligence Save': {has_proficiency: false, should_override: false, override_value: 0},
	        'Wisdom Save': {has_proficiency: false, should_override: false, override_value: 0},
	        'Charisma Save': {has_proficiency: false, should_override: false, override_value: 0},
	        'Strength Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Dexterity Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Constitution Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Intelligence Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Wisdom Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Charisma Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Acrobatics Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Animal Handling Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Arcana Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Athletics Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Deception Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'History Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Insight Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Intimidation Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Investigation Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Medicine Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Nature Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Perception Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Performance Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Persuasion Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Religion Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Sleight of Hand Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Stealth Check': {has_proficiency: false, should_override: false, override_value: 0},
	        'Survival Check': {has_proficiency: false, should_override: false, override_value: 0}
	    };
	    this.spellcasting_mod = 'int';

	    this.other_proficiencies = {}; //None

		this.attack_roll_type = 'Normal';
		this.check_roll_type = 'Normal';
		this.weapons = [ 
			new Weapon('short bow', 'sBow', 0, [6], 0, 'dex', [], false, false, Number.MAX_SAFE_INTEGER, 0),
			new Weapon('short sword', 'sSrd', 0, [6], 0, 'dex', [], false, false, 0, 0),
			new Weapon('fireball', 'frBl', 0, [6,6,6,6,6,6,6,6], 0, 'int', [], true, false, 3, 3),
			new Weapon('wnd magic mssl', 'mMsl', 999, [4,4,4], 3, 'int', [], true, true, 7, 7)
		];
		this.selected_weapon = this.weapons[0];
		this.attack_rolls = [];
		this.damage_rolls = [];
		this.check_rolls = [];

		this.should_reroll_attack = true;
		this.should_reroll_damage = true;
		this.should_reroll_check = true;
		this.attack = 0;
		this.damage = 0;
		this.damage_contribute_to_total = true;
		this.attack_roll = 0;
		this.attack_is_save_dc = false;
	}

	static to_json(minion) {
		minion.version = Constants.version;
		return JSON.serialize(minion);
	}

	static from_json(json_string) {
		let deserialized_object = JSON.parse(json_string);
		switch(deserialized_object.version) {
			case '0.1':
				return this._create_minion_from_object(deserialized_object);
			default:
				console.log('Could not find conversion method for version \'' + deserialized_object.version + '\' on minion. Assuming current version.');
				return this._create_minion_from_object(deserialized_object);
		}
		return 
	}

	static _create_minion_from_object(object) {
		let minion = new Minion();
		for (key in minion) {
			minion[key] = object[key];
		}
		return minion;
	}
}